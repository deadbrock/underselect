import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createTeam,
  listTeams,
} from '@infrastructure/database/repositories/team.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const createTeamSchema = z.object({
  name: z.string().trim().min(2),
});

export async function GET() {
  try {
    const teams = await listTeams();
    return NextResponse.json(toApiResponse(teams));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTeamSchema.parse(body);
    const team = await createTeam(parsed);
    return NextResponse.json(toApiResponse(team), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
