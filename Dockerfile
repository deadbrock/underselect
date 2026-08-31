# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts \
  && npm rebuild sharp onnxruntime-node --foreground-scripts \
  && if [ -d node_modules/@imgly/background-removal-node ]; then \
       npm rebuild --prefix node_modules/@imgly/background-removal-node --foreground-scripts; \
     fi

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

RUN npx prisma generate
RUN npm run build
RUN mkdir -p /opt/native-mods \
  && cp -a node_modules/@imgly /opt/native-mods/ \
  && if [ -d node_modules/onnxruntime-node ]; then cp -a node_modules/onnxruntime-node /opt/native-mods/; fi \
  && if [ -d node_modules/onnxruntime-common ]; then cp -a node_modules/onnxruntime-common /opt/native-mods/; fi \
  && if [ -d node_modules/sharp ]; then cp -a node_modules/sharp /opt/native-mods/; fi

# =============================================================================
# Stage 3: Runner
# =============================================================================
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /opt/native-mods/ ./node_modules/

RUN mkdir -p /app/uploads/products && chown -R nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
