import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateTimestamp } from '@/util/timestampUtil';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
const { isTesting } = require("@/util/testHelpers");

dayjs.extend(utc);

const ERR_INVALID_TIME_FORMAT = 'Invalid time format. Please use 24-hour format (HH:mm) and try again.';
const ERR_INVALID_TIME_RANGE = 'Invalid time range. hour must be between 0-23, and minute must be between 0-59';

export type RegexGroup = {
  hour: string;
  minute: string;
}

export type IsValidTimeParams = RegexGroup & {
  interaction: CommandInteraction;
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

function isValidTime({hour, minute}: RegexGroup) {
  const hourInt = parseInt(hour);
  const minInt = parseInt(minute);
  if(hourInt < 0 || hourInt > 23) {
    return false;
  }
  if (minInt > 59 || minInt < 0) {
    return false;
  }
  return true;
}

export async function execute(interaction: CommandInteraction) {
  const [time, offset] = interaction.options.data;
  const regex = /^(?<hour>[0-9]{1,2}):(?<minute>[0-9]{2})$/;
  if(!regex.test(time.value as string ?? "")){
    return interaction.reply({
      content: ERR_INVALID_TIME_FORMAT,
      ephemeral: true
    });
  }

  const { hour, minute } = regex.exec(time.value as string)!.groups as RegexGroup;
  if (!isValidTime({hour,minute})) {
    return interaction.reply({
      content: ERR_INVALID_TIME_RANGE,
      ephemeral: true
    });
  }
  
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

if(isTesting()) {
  module.exports.isValidTime = isValidTime;
  module.exports.ERR_INVALID_TIME_FORMAT =  ERR_INVALID_TIME_FORMAT;
  module.exports.ERR_INVALID_TIME_RANGE =  ERR_INVALID_TIME_RANGE;
}