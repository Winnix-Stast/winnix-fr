import { CreateTeamIcon, CreateTournamentIcon, EmptyTournamentIcon, PlusIcon } from "./IconsSvg";

export const IconLibrary = {
  "empty-tournament": EmptyTournamentIcon,
  "create-tournament": CreateTournamentIcon,
  "create-team": CreateTeamIcon,
  plus: PlusIcon,
};

export type IconName = keyof typeof IconLibrary;
