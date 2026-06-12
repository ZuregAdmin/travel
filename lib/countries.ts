export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export const CONTINENTS: Continent[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

// ISO 3166-1 alpha-2 codes grouped by continent (UN members + observers + TW/XK).
const CODES: Record<Continent, string> = {
  Africa:
    "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW",
  Asia: "AF AM AZ BH BD BT BN KH CN CY GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE",
  Europe:
    "AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA",
  "North America":
    "AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US",
  "South America": "AR BO BR CL CO EC GY PY PE SR UY VE",
  Oceania: "AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU",
};

// Names Intl.DisplayNames doesn't render the way we want.
const NAME_OVERRIDES: Record<string, string> = {
  XK: "Kosovo",
  CD: "DR Congo",
  CG: "Republic of the Congo",
};

const display = new Intl.DisplayNames(["en"], { type: "region" });

export interface Country {
  code: string;
  name: string;
  continent: Continent;
  flag: string;
}

export function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export const COUNTRIES: Country[] = (
  Object.entries(CODES) as [Continent, string][]
)
  .flatMap(([continent, codes]) =>
    codes.split(" ").map((code) => ({
      code,
      name: NAME_OVERRIDES[code] ?? display.of(code) ?? code,
      continent,
      flag: flagEmoji(code),
    }))
  )
  .sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
