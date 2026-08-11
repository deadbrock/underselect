import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteTeam,
  updateTeam,
} from '@infrastructure/database/repositories/team.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateTeamSchema = z.object({
  name: z.string().trim().min(2).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateTeamSchema.parse(body);
    const team = await updateTeam(id, parsed);
    return NextResponse.json(toApiResponse(team));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteTeam(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
