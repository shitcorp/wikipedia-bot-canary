import { interaction } from './interaction';

interface Command {
  id: string;
  name: string;
  help: string;
  execute: (interaction: interaction) => Promise<void>;
}

interface CommandRaw {
  name: string;
  description: string;
  options?: CommandRawOptions[];
}

interface CommandRawOptions {
  name: string;
  description: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  choices?: CommandRawChoices[];
  required?: boolean;
}

interface CommandRawChoices {
  name: string;
  value: string;
}
