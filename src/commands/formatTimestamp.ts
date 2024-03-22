import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateTimestamp } from '@/util/timestampUtil';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type RegexGroup = {
  hour: string;
  minute: string;
}

export const data = new SlashCommandBuilder()
  .setName("ft")
  .setDescription("Formats a Discord timestamp.")
  .addStringOption(o => 
    o.setName('time')
      .setDescription('Set the time in 24-hour format: HH:mm')
      .setRequired(true))
  .addIntegerOption(o =>
    o.setName('offset')
      .setDescription('Your timezone offset (ex: -4)')
      .setRequired(true));
  
  

export async function execute(interaction: CommandInteraction) {
  const [time, offset] = interaction.options.data;
  const regex = /^(?<hour>[0-9]{1,2}):(?<minute>[0-9]{2})$/;
  if(!regex.test(time.value as string ?? "")){
    return interaction.reply({
      content: 'Invalid time format. Please use 24-hour format (HH:mm) and try again.',
      ephemeral: true
    });
  }
  const { hour, minute } = regex.exec(time.value as string)!.groups as RegexGroup;
  
  const date = dayjs()
    .add(1, 'day')
    .set('hour', parseInt(hour))
    .set('minute', parseInt(minute))
    .utcOffset(offset.value as number);
  const ts = generateTimestamp({ date: date.toDate(), type: 'short' });
  
  return interaction.reply({
    content: `\`${ts}\``,
    ephemeral: true
  });
}