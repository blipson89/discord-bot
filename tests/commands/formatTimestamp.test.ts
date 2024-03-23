process.env['NODE_DEV'] = 'TEST';
import { execute, RegexGroup } from "@/commands/formatTimestamp";
import * as timestampUtil from "@/util/timestampUtil";
import { ApplicationCommandOptionType, CommandInteraction, CommandInteractionOption, InteractionReplyOptions, MessagePayload, time } from "discord.js";

jest.spyOn(timestampUtil, "generateTimestamp").mockImplementation(() => "SOME_TIMESTAMP");
const { isValidTime, ERR_INVALID_TIME_FORMAT, ERR_INVALID_TIME_RANGE } = require("@/commands/formatTimestamp");

describe("formatTimestamp.isValidTime", () => {
  const positiveTestCases: RegexGroup[] = [
    {hour: "00", minute: "00"},
    {hour: "10", minute: "30"},
    {hour: "16", minute: "59"}
  ];
  const negativeTestCases: RegexGroup[] = [
    {hour: "-1", minute: "00"},
    {hour: "24", minute: "00"},
    {hour: "04", minute: "60"},
    {hour: "12", minute: "75"},
    {hour: "01", minute: "-20"},
    {hour: "-10", minute: "-10"},
  ];

  positiveTestCases.forEach(tc => {
    test(`Positive Case: ${JSON.stringify(tc)}`, () => {
      expect(isValidTime(tc)).toBe(true);
    })
  });
  negativeTestCases.forEach(tc => {
    test(`Negative Case: ${JSON.stringify(tc)}`, () => {
      expect(isValidTime(tc)).toBe(false);
    })
  });
})

describe("formatTimestamp.execute (Positive Cases)", () => {
  const reply = jest.fn();
  const testCases: CommandInteractionOption[][] = [
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '00:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '-4'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '10:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '4'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '12:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ]
  ];
  testCases.forEach(tc => {
    // @ts-ignore
    const interaction: CommandInteraction = {
      // @ts-ignore
       options: {
        data: tc
       },
       reply
    };
    test(`Positive Case: ${tc[0].value}, ${tc[1].value}`, () => {
      execute(interaction);
      expect(reply).toHaveBeenCalledWith({content: '`SOME_TIMESTAMP`', ephemeral: true})
    })
  })
})

describe("formatTimestamp.execute (Negative Case: Bad Format)", () => {
  const reply = jest.fn();
  const testCases: CommandInteractionOption[][] = [
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '100:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '4'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '12:000'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '12000'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ]
    ,
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: 'aaaa'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ]
  ];

  testCases.forEach(tc => {
    // @ts-ignore
    const interaction: CommandInteraction = {
      // @ts-ignore
       options: {
        data: tc
       },
       reply
    };
    test(`Negative Case: ${tc[0].value}, ${tc[1].value}`, () => {
      execute(interaction);
      expect(reply).toHaveBeenCalledWith({content: ERR_INVALID_TIME_FORMAT, ephemeral: true})
    })
  });
})

describe("formatTimestamp.execute (Negative Case: Bad Range)", () => {
  const reply = jest.fn();
  const testCases: CommandInteractionOption[][] = [
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '24:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '4'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '12:60'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ],
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '90:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ]
    ,
    [
      {name: 'time', type: ApplicationCommandOptionType.String, value: '-10:00'},
      {name: 'offset', type: ApplicationCommandOptionType.Integer, value: '0'},
    ]
  ];

  testCases.forEach(tc => {
    // @ts-ignore
    const interaction: CommandInteraction = {
      // @ts-ignore
       options: {
        data: tc
       },
       reply
    };
    test(`Negative Case: ${tc[0].value}, ${tc[1].value}`, () => {
      execute(interaction);
      expect(reply).toHaveBeenCalledWith({content: ERR_INVALID_TIME_RANGE, ephemeral: true})
    })
  });
})