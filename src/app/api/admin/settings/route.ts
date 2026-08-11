import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import {
  getStoreSettings,
  resetStoreSettings,
  updateStoreSettings,
} from '@infrastructure/database/repositories/store-settings.repository';
import { adminStoreSettingsSchema } from '@presentation/stores/admin/settings/settings.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(toApiResponse(settings));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminStoreSettingsSchema.parse(body);
    const current = await getStoreSettings();
    const settings = await updateStoreSettings({
      ...current,
      ...parsed,
      contactPhone: parsed.contactPhone ?? '',
      shippingOriginComplement: parsed.shippingOriginComplement ?? '',
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(toApiResponse(settings));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === 'reset') {
      const settings = await resetStoreSettings();
      revalidatePath('/', 'layout');
      return NextResponse.json(toApiResponse(settings));
    }

    return NextResponse.json(toApiErrorResponse(new Error('Ação inválida')), {
      status: 400,
    });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
