import { formatTaxYearLabel, getCurrentTaxYearStartYear } from "../taxYear";
import type { PlanType } from "./types";

/**
 * SLC overseas repayment thresholds for the 2026/27 tax year
 * (2026-04-06 to 2027-04-05).
 *
 * SLC revises every figure in this file on 6 April each year: the thresholds,
 * the fixed monthly repayments and the HMRC exchange rates. Refresh the whole
 * file from the five GOV.UK tables when the next tax year is published:
 *   Plan 1: https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-1-student-loans/overseas-earnings-thresholds-for-plan-1-student-loans-2026-27
 *   Plan 2: https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-2-student-loans/overseas-earnings-thresholds-for-plan-2-student-loans-2026-27
 *   Plan 4: https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-4-student-loans/overseas-earnings-thresholds-for-plan-4-student-loans-2026-27
 *   Plan 5: https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-5-student-loans/overseas-earnings-thresholds-for-plan-5-student-loans-2026-to-2027
 *   Postgraduate: https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-postgraduate-student-loans/overseas-earnings-thresholds-for-postgraduate-student-loans-2026-27
 *
 * GOV.UK prints no band letters — it lists one row per territory. The seven
 * bands A–G are ours, ordered from the lowest multiplier (0.2×) to the
 * highest (1.4×). The territory-to-band mapping and the exchange rates are
 * identical across all five publications.
 *
 * Two GOV.UK data defects are corrected here. The Plan 5 table gives North
 * Korea a fixed monthly repayment of £76.80 where every other 0.4× territory
 * shows £176.80 — treated as a typo, so band B carries £176.80. Bulgaria is
 * labelled "Bulgarian Lev" on three tables although all five apply the euro
 * rate (Bulgaria adopted the euro on 1 January 2026), so it is labelled
 * "Euro" throughout.
 */

/** ISO date the figures took effect. */
export const OVERSEAS_APPLIES_FROM = "2026-04-06";

/** The tax year the figures belong to, e.g. "2026/27". */
export const OVERSEAS_TAX_YEAR = formatTaxYearLabel(
  // Parsed as local time: a UTC midnight falls on 5 April west of Greenwich and
  // would read as the previous tax year.
  getCurrentTaxYearStartYear(new Date(`${OVERSEAS_APPLIES_FROM}T00:00:00`)),
);

/** The GOV.UK country tables for this tax year, per plan. */
export const OVERSEAS_SOURCE_URLS: Record<PlanType, string> = {
  PLAN_1:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-1-student-loans/overseas-earnings-thresholds-for-plan-1-student-loans-2026-27",
  PLAN_2:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-2-student-loans/overseas-earnings-thresholds-for-plan-2-student-loans-2026-27",
  PLAN_4:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-4-student-loans/overseas-earnings-thresholds-for-plan-4-student-loans-2026-27",
  PLAN_5:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-5-student-loans/overseas-earnings-thresholds-for-plan-5-student-loans-2026-to-2027",
  POSTGRADUATE:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-postgraduate-student-loans/overseas-earnings-thresholds-for-postgraduate-student-loans-2026-27",
};

/** The parent GOV.UK publications (methodology and worked examples), per plan. */
export const OVERSEAS_PUBLICATION_URLS: Record<PlanType, string> = {
  PLAN_1:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-1-student-loans",
  PLAN_2:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-2-student-loans",
  PLAN_4:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-4-student-loans",
  PLAN_5:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-5-student-loans",
  POSTGRADUATE:
    "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-postgraduate-student-loans",
};

export type OverseasBandId = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface OverseasBand {
  id: OverseasBandId;
  /** Multiple of the UK repayment threshold, 0.2 to 1.4. */
  multiplier: number;
  /** Annual repayment threshold in GBP, per plan. */
  thresholds: Record<PlanType, number>;
  /** Fixed monthly repayment in GBP charged when details are not kept up to date, per plan. */
  fixedMonthly: Record<PlanType, number>;
  /** Plan 2 upper interest threshold in GBP — only Plan 2 publishes one. */
  plan2UpperThreshold: number;
}

export interface OverseasTerritory {
  name: string;
  band: OverseasBandId;
  /** Currency name as GOV.UK prints it. */
  currency: string;
  /** HMRC annual-average rate: what one unit of the currency is worth in GBP. */
  exchangeRateToGBP: number;
}

export const OVERSEAS_BANDS_BY_ID: Record<OverseasBandId, OverseasBand> = {
  A: {
    id: "A",
    multiplier: 0.2,
    thresholds: {
      PLAN_1: 5380,
      PLAN_2: 5875,
      PLAN_4: 6770,
      PLAN_5: 5000,
      POSTGRADUATE: 4200,
    },
    fixedMonthly: {
      PLAN_1: 85.6,
      PLAN_2: 81.8,
      PLAN_4: 40.2,
      PLAN_5: 88.4,
      POSTGRADUATE: 63,
    },
    plan2UpperThreshold: 10575,
  },
  B: {
    id: "B",
    multiplier: 0.4,
    thresholds: {
      PLAN_1: 10760,
      PLAN_2: 11755,
      PLAN_4: 13525,
      PLAN_5: 10000,
      POSTGRADUATE: 8400,
    },
    fixedMonthly: {
      PLAN_1: 171.2,
      PLAN_2: 163.6,
      PLAN_4: 80.4,
      PLAN_5: 176.8,
      POSTGRADUATE: 126,
    },
    plan2UpperThreshold: 21155,
  },
  C: {
    id: "C",
    multiplier: 0.6,
    thresholds: {
      PLAN_1: 16140,
      PLAN_2: 17630,
      PLAN_4: 20290,
      PLAN_5: 15000,
      POSTGRADUATE: 12600,
    },
    fixedMonthly: {
      PLAN_1: 256.8,
      PLAN_2: 245.4,
      PLAN_4: 120.6,
      PLAN_5: 265.2,
      POSTGRADUATE: 189,
    },
    plan2UpperThreshold: 31730,
  },
  D: {
    id: "D",
    multiplier: 0.8,
    thresholds: {
      PLAN_1: 21520,
      PLAN_2: 23510,
      PLAN_4: 27045,
      PLAN_5: 20000,
      POSTGRADUATE: 16800,
    },
    fixedMonthly: {
      PLAN_1: 342,
      PLAN_2: 327.2,
      PLAN_4: 160.8,
      PLAN_5: 353.6,
      POSTGRADUATE: 252,
    },
    plan2UpperThreshold: 42310,
  },
  E: {
    id: "E",
    multiplier: 1,
    thresholds: {
      PLAN_1: 26900,
      PLAN_2: 29385,
      PLAN_4: 33795,
      PLAN_5: 25000,
      POSTGRADUATE: 21000,
    },
    fixedMonthly: {
      PLAN_1: 428,
      PLAN_2: 409,
      PLAN_4: 201,
      PLAN_5: 442,
      POSTGRADUATE: 315,
    },
    plan2UpperThreshold: 52885,
  },
  F: {
    id: "F",
    multiplier: 1.2,
    thresholds: {
      PLAN_1: 32280,
      PLAN_2: 35260,
      PLAN_4: 40565,
      PLAN_5: 30000,
      POSTGRADUATE: 25200,
    },
    fixedMonthly: {
      PLAN_1: 513.6,
      PLAN_2: 490.8,
      PLAN_4: 241,
      PLAN_5: 530.4,
      POSTGRADUATE: 378,
    },
    plan2UpperThreshold: 63460,
  },
  G: {
    id: "G",
    multiplier: 1.4,
    thresholds: {
      PLAN_1: 37660,
      PLAN_2: 41140,
      PLAN_4: 47320,
      PLAN_5: 35000,
      POSTGRADUATE: 29400,
    },
    fixedMonthly: {
      PLAN_1: 599.2,
      PLAN_2: 572.6,
      PLAN_4: 281.4,
      PLAN_5: 618.8,
      POSTGRADUATE: 441,
    },
    plan2UpperThreshold: 74040,
  },
};

/** The bands in ladder order, lowest multiplier first. */
export const OVERSEAS_BANDS: readonly OverseasBand[] =
  Object.values(OVERSEAS_BANDS_BY_ID);

/** The UK thresholds the bands multiply — band E is the 1.0× band. */
export const OVERSEAS_UK_THRESHOLDS: Record<PlanType, number> =
  OVERSEAS_BANDS_BY_ID.E.thresholds;

// Tuple rows keep the 248-territory table compact: [name, band, currency, rate].
type TerritoryRow = readonly [string, OverseasBandId, string, number];

/** Every territory GOV.UK lists, A–Z by name. */
export const OVERSEAS_TERRITORIES: readonly OverseasTerritory[] = (
  [
    ["Afghanistan", "A", "Afghanis", 0.010752],
    ["Aland Islands", "E", "Euro", 0.853461],
    ["Albania", "B", "Leke", 0.008712],
    ["Algeria", "B", "Algerian Dinar", 0.005765],
    ["American Samoa", "F", "U.S. Dollar", 0.760109],
    ["Andorra", "D", "Euro", 0.853461],
    ["Angola", "B", "Kwanza", 0.000828],
    ["Anguilla", "E", "East Caribbean Dollar", 0.280812],
    ["Antarctica", "E", "U.S. Dollar", 0.760109],
    ["Antigua and Barbuda", "D", "East Caribbean Dollar", 0.280812],
    ["Argentina", "C", "Argentine Peso", 0.000623],
    ["Armenia", "B", "Dram", 0.001963],
    ["Aruba", "E", "Aruban Guilder", 0.424628],
    ["Australia", "E", "Australian Dollar", 0.489572],
    ["Austria", "E", "Euro", 0.853461],
    ["Azerbaijan", "B", "Azerbaijanian Manat", 0.447107],
    ["Bahamas", "F", "Bahamian Dollar", 0.760109],
    ["Bahrain", "C", "Bahrain Dinar", 2.021427],
    ["Bangladesh", "B", "Taka", 0.006252],
    ["Barbados", "F", "Barbados Dollar", 0.38004],
    ["Belarus", "A", "Belarusian Ruble", 0.229484],
    ["Belgium", "D", "Euro", 0.853461],
    ["Belize", "C", "Belizean Dollar", 0.3779],
    ["Benin", "B", "CFA Franc (BEAC)", 0.001301],
    ["Bermuda", "G", "Bermudian Dollar", 0.760109],
    ["Bhutan", "A", "Bhutanese Ngultrum", 0.00877],
    ["Bolivia", "B", "Boliviano", 0.110016],
    ["Bonaire, Saint Eustatius and Saba", "E", "U.S. Dollar", 0.760109],
    ["Bosnia and Herzegovina", "B", "Convertible Marka", 0.436357],
    ["Botswana", "B", "Pula", 0.055907],
    ["Bouvet Island", "E", "Norwegian Krone", 0.072895],
    ["Brazil", "C", "Brazilian Real", 0.134876],
    ["British Indian Ocean Territory", "E", "U.S. Dollar", 0.760109],
    ["Brunei", "B", "Brunei Dollar", 0.580889],
    ["Bulgaria", "B", "Euro", 0.853461],
    ["Burkina Faso", "B", "CFA Franc (BEAC)", 0.001301],
    ["Burundi", "A", "Burundi Franc", 0.000256],
    ["Cambodia", "B", "Riel", 0.000189],
    ["Cameroon", "B", "CFA Franc (BEAC)", 0.001301],
    ["Canada", "E", "Canadian Dollar", 0.543508],
    ["Cape Verde", "C", "Cape Verde Escudo", 0.00774],
    ["Cayman Islands", "G", "Cayman Islands Dollar", 0.916254],
    ["Central African Republic", "B", "CFA Franc (BEAC)", 0.001301],
    ["Chad", "B", "CFA Franc (BEAC)", 0.001301],
    ["Channel Islands", "E", "British Pound", 1],
    ["Chile", "C", "Chilean Peso", 0.000797],
    ["China", "C", "Yuan Renminbi", 0.105538],
    ["Christmas Island", "E", "Australian Dollar", 0.489572],
    ["Cocos (Keeling) Islands", "E", "Australian Dollar", 0.489572],
    ["Colombia", "B", "Colombian Peso", 0.000186],
    ["Comoros", "B", "Comorian Franc", 0.001735],
    ["Congo", "B", "Congolese Franc", 0.000274],
    ["Congo, Democratic Republic of", "B", "Congolese Franc", 0.000274],
    ["Cook Islands", "E", "New Zealand Dollar", 0.44342],
    ["Costa Rica", "D", "Costa Rican Colon", 0.001509],
    ["Cote d’Ivoire", "B", "CFA Franc (BEAC)", 0.001301],
    ["Croatia", "C", "Euro", 0.853461],
    ["Cuba", "C", "Cuban Peso", 0.0317],
    ["Curacao", "E", "Antillean Guilder", 0.437573],
    ["Cyprus", "D", "Euro", 0.853461],
    ["Czech Republic", "C", "Czech Koruna", 0.034473],
    ["Denmark", "E", "Danish Krone", 0.114356],
    ["Djibouti", "C", "Djiboutian Franc", 0.00427],
    ["Dominica", "C", "East Caribbean Dollar", 0.280812],
    ["Dominican Republic", "B", "Dominican Peso", 0.012352],
    ["Ecuador", "B", "U.S. Dollar", 0.760109],
    ["Egypt", "A", "Egyptian Pound", 0.015344],
    ["El Salvador", "B", "U.S. Dollar", 0.760109],
    ["Equatorial Guinea", "B", "CFA Franc (BEAC)", 0.001301],
    ["Eritrea", "B", "Nafka", 0.050673],
    ["Estonia", "D", "Euro", 0.853461],
    ["Ethiopia", "B", "Ethiopian Birr", 0.005566],
    ["Faeroe Islands", "E", "Danish Krone", 0.114356],
    ["Falkland Islands", "E", "Falkland Pound", 1],
    ["Federated States of Micronesia", "F", "U.S. Dollar", 0.760109],
    ["Fiji", "B", "Fiji Dollar", 0.333912],
    ["Finland", "E", "Euro", 0.853461],
    ["France", "D", "Euro", 0.853461],
    ["French Guiana", "D", "Euro", 0.853461],
    ["French Polynesia", "E", "CFP Franc", 0.007152],
    ["French Southern Territories", "D", "Euro", 0.853461],
    ["Gabon", "B", "CFA Franc (BEAC)", 0.001301],
    ["Gambia", "A", "Dalasi", 0.010492],
    ["Georgia", "B", "Lari", 0.276564],
    ["Germany", "D", "Euro", 0.853461],
    ["Ghana", "B", "Ghanaian Cedi", 0.05949],
    ["Gibraltar", "E", "British Pound", 1],
    ["Greece", "C", "Euro", 0.853461],
    ["Greenland", "E", "Danish Krone", 0.114356],
    ["Grenada", "C", "East Caribbean Dollar", 0.280812],
    ["Guadeloupe", "D", "Euro", 0.853461],
    ["Guam", "F", "U.S. Dollar", 0.760109],
    ["Guatemala", "B", "Quetzal", 0.098923],
    ["Guinea", "B", "Guinean Franc", 0.000088],
    ["Guinea-Bissau", "B", "CFA Franc (BCEAO)", 0.001301],
    ["Guyana", "B", "Guyanese Dollar", 0.003635],
    ["Haiti", "D", "Gourde", 0.005808],
    ["Heard and McDonald Islands", "E", "Australian Dollar", 0.489572],
    ["Holy See (Vatican City State)", "D", "Euro", 0.853461],
    ["Honduras", "C", "Lempira", 0.029297],
    ["Hong Kong", "D", "Hong Kong Dollar", 0.097498],
    ["Hungary", "C", "Forint", 0.002137],
    ["Iceland", "F", "Icelandic Krona", 0.005906],
    ["India", "A", "Indian Rupee", 0.00877],
    ["Indonesia", "B", "Indonesian Rupiah", 0.000046],
    ["Iran", "B", "Iranian Rial", 0.000025],
    ["Iraq", "B", "Iraqi Dinar", 0.000581],
    ["Ireland", "E", "Euro", 0.853461],
    ["Isle of Man", "E", "British Pound", 1],
    ["Israel", "F", "New Israeli Shekel", 0.218756],
    ["Italy", "D", "Euro", 0.853461],
    ["Jamaica", "C", "Jamaican Dollar", 0.004784],
    ["Japan", "D", "Yen", 0.005097],
    ["Jordan", "B", "Jordanian Dinar", 1.072041],
    ["Kazakhstan", "B", "Tenge", 0.001452],
    ["Kenya", "B", "Kenya Schilling", 0.005877],
    ["Kiribati", "D", "Australian Dollar", 0.489572],
    [
      "Korea, Democratic People’s Republic of",
      "B",
      "Won Korea Dem. Rep",
      0.466523,
    ],
    ["Korea, Republic of", "D", "Won Korea Rep", 0.000537],
    ["Kosovo", "B", "Euro", 0.853461],
    ["Kuwait", "D", "Kuwaiti Dinar", 2.477701],
    ["Kyrgyztan Republic", "B", "Kyrgyzstan Som", 0.008693],
    ["Lao PDR", "A", "Kip", 0.000035],
    ["Latvia", "C", "Euro", 0.853461],
    ["Lebanon", "B", "Lebanese Pound", 0.000008],
    ["Lesotho", "B", "Loti", 0.042393],
    ["Liberia", "C", "Liberian Dollar (US Dollar in use)", 0.003937],
    ["Libya", "C", "Libyan Dinar", 0.144215],
    ["Liechtenstein", "E", "Swiss Franc", 0.911079],
    ["Lithuania", "C", "Euro", 0.853461],
    ["Luxembourg", "E", "Euro", 0.853461],
    ["Macau", "C", "Patacas", 0.094658],
    ["Macedonia (Former Yugoslav Republic)", "B", "Macedonian Denar", 0.013871],
    ["Madagascar", "B", "Malagasy Ariary", 0.000167],
    ["Malawi", "B", "Malawi Kwacha", 0.000439],
    ["Malaysia", "B", "Ringgit", 0.176395],
    ["Maldives", "C", "Rufiyaa", 0.049235],
    ["Mali", "B", "CFA Franc (BCEAO)", 0.001301],
    ["Malta", "D", "Euro", 0.853461],
    ["Marshall Islands", "E", "U.S. Dollar", 0.760109],
    ["Martinique", "D", "Euro", 0.853461],
    ["Mauritania", "B", "Ouguiyas", 0.019128],
    ["Mauritius", "B", "Mauritius Rupee", 0.016633],
    ["Mayotte", "D", "Euro", 0.853461],
    ["Mexico", "C", "Mexican Peso", 0.039402],
    ["Moldova", "B", "Moldovan Leu", 0.04342],
    ["Monaco", "E", "Euro", 0.853461],
    ["Mongolia", "B", "Tugrik", 0.000215],
    ["Montenegro", "B", "Euro", 0.853461],
    ["Montserrat", "E", "East Caribbean Dollar", 0.280812],
    ["Morocco", "B", "Moroccan Dirham", 0.080992],
    ["Mozambique", "B", "Metical", 0.011894],
    ["Myanmar", "A", "Kyat", 0.000362],
    ["Namibia", "B", "Namibian Dollar", 0.042393],
    ["Nauru", "F", "Australian Dollar", 0.489572],
    ["Nepal", "A", "Nepalese Rupee", 0.005479],
    ["Netherlands", "E", "Euro", 0.853461],
    ["New Caledonia", "E", "CFP Franc", 0.007152],
    ["New Zealand", "E", "New Zealand Dollar", 0.44342],
    ["Nicaragua", "B", "Gold Cordoba", 0.020664],
    ["Niger", "B", "CFA Franc (BCEAO)", 0.001301],
    ["Nigeria", "A", "Nigerian Naira", 0.000497],
    ["Niue", "E", "New Zealand Dollar", 0.44342],
    ["Norfolk Island", "E", "Australian Dollar", 0.489572],
    ["Northern Mariana Islands", "F", "U.S. Dollar", 0.760109],
    ["Norway", "E", "Norwegian Krone", 0.072895],
    ["Oman", "C", "Rial Omani", 1.974724],
    ["Pakistan", "A", "Pakistan Rupee", 0.002699],
    ["Palau", "E", "U.S. Dollar", 0.760109],
    ["Palestine (Occupied Territory)", "C", "New Israeli Shekel", 0.218756],
    ["Panama", "C", "Balboas", 0.760109],
    ["Papua New Guinea", "D", "Kina", 0.183871],
    ["Paraguay", "B", "Guarani", 0.0001],
    ["Peru", "C", "New Sol", 0.211443],
    ["Philippines", "B", "Philippine Peso", 0.013217],
    ["Pitcairn", "E", "New Zealand Dollar", 0.44342],
    ["Poland", "C", "Zloty", 0.201268],
    ["Portugal", "C", "Euro", 0.853461],
    ["Puerto Rico", "F", "U.S. Dollar", 0.760109],
    ["Qatar", "D", "Qatar Riyal", 0.208816],
    ["Reunion", "D", "Euro", 0.853461],
    ["Romania", "B", "Romanian Leu", 0.16971],
    ["Russian Federation", "B", "Russian Ruble", 0.00896],
    ["Rwanda", "B", "Rwanda Franc", 0.000533],
    ["Saint Helena", "E", "Saint Helena Pound", 1],
    ["Saint Kitts and Nevis", "D", "East Caribbean Dollar", 0.280812],
    ["Saint Lucia", "C", "East Caribbean Dollar", 0.280812],
    ["Saint Martin (French part)", "D", "Euro", 0.853461],
    ["Saint Pierre and Miquelon", "D", "Euro", 0.853461],
    ["Saint Vincent and Grenadines", "C", "East Caribbean Dollar", 0.280812],
    ["Saint-Barthelemy", "D", "Euro", 0.853461],
    ["Samoa", "D", "Tala", 0.27552],
    ["San Marino", "D", "Euro", 0.853461],
    ["Sao Tome and Principe", "C", "Dobras", 0.000035],
    ["Saudi Arabia", "C", "Saudi Riyal", 0.202692],
    ["Senegal", "B", "CFA Franc (BEAC)", 0.001301],
    ["Serbia", "B", "Serbian Dinar", 0.007283],
    ["Seychelles", "C", "Seychelles Rupee", 0.052698],
    ["Sierra Leone", "A", "Leone", 0.000063],
    ["Singapore", "C", "Singapore Dollar", 0.580889],
    ["Sint Maarten (Dutch part)", "E", "Antilles Guilder", 0.437573],
    ["Slovakia", "C", "Euro", 0.853461],
    ["Slovenia", "C", "Euro", 0.853461],
    ["Solomon Islands", "D", "Solomon Islands Dollar", 0.089709],
    ["Somalia", "B", "Somali Shilling", 0.001332],
    ["South Africa", "B", "Rand", 0.042393],
    ["South Georgia and the South Sandwich Islands", "E", "British Pound", 1],
    ["South Sudan", "B", "Sudanese Pound", 0.001265],
    ["Spain", "D", "Euro", 0.853461],
    ["Sri Lanka", "B", "Sri Lankan Rupee", 0.002536],
    ["Sudan", "C", "Sudanese Pound", 0.001265],
    ["Suriname", "B", "Surinam Dollar", 0.020442],
    ["Svalbard and Jan Mayen Islands", "E", "Norwegian Krone", 0.072895],
    ["Swaziland", "B", "Lilangeni", 0.042393],
    ["Sweden", "E", "Swedish Krona", 0.076765],
    ["Switzerland", "F", "Swiss Franc", 0.911079],
    ["Syria", "A", "Syrian Pound", 0.00399],
    ["Taiwan", "E", "Taiwan Dollar", 0.02437],
    ["Tajikistan", "A", "Somoni", 0.12336],
    ["Thailand", "B", "Thai Baht", 0.02306],
    ["Timor-Leste", "B", "U.S. Dollar", 0.760109],
    ["Togo", "B", "CFA Franc (BEAC)", 0.001301],
    ["Tokelau", "E", "New Zealand Dollar", 0.44342],
    ["Tonga", "D", "Pa’anga", 0.315746],
    ["Trinidad and Tobago", "C", "Trinidad & Tobago Dollar", 0.112032],
    ["Tunisia", "B", "Tunisian Dinar", 0.253197],
    ["Turkey", "B", "Turkish New Lira", 0.019438],
    ["Turkmenistan", "B", "Turkmenistan New Manat", 0.217089],
    ["Turks and Caicos Islands", "F", "U.S. Dollar", 0.760109],
    ["Tuvalu", "F", "Australian Dollar", 0.489572],
    ["Uganda", "B", "Ugandan New Shilling", 0.00021],
    ["Ukraine", "B", "Hryvnia", 0.018251],
    ["United Arab Emirates", "D", "U.A.E. Dirham", 0.206966],
    ["United Kingdom", "E", "British Pound", 1],
    ["United republic of Tanzania", "B", "Tanzanian Shilling", 0.000297],
    ["United States of America", "F", "U.S. Dollar", 0.760109],
    ["Uruguay", "D", "Uruguayan Peso", 0.018293],
    ["Uzbekistan", "B", "Uzbekistan Sum", 0.00006],
    ["Vanuatu", "E", "Vatu", 0.006265],
    ["Venezuela", "C", "Bolivar Fuerte", 0.002352],
    ["Vietnam", "B", "Dong", 0.000029],
    ["Virgin Islands (British)", "E", "U.S. Dollar", 0.760109],
    ["Virgin Islands (US)", "F", "U.S. Dollar", 0.760109],
    ["Wallis and Futuna Islands", "B", "CFP Franc", 0.007152],
    ["Western Sahara", "B", "Moroccan Dirham", 0.080992],
    ["Yemen", "B", "Yemeni Rial", 0.003121],
    ["Zambia", "B", "Zambian Kwacha", 0.029697],
    ["Zimbabwe", "B", "Zimbabwean Gold", 0.028502],
  ] satisfies readonly TerritoryRow[]
).map(([name, band, currency, exchangeRateToGBP]) => ({
  name,
  band,
  currency,
  exchangeRateToGBP,
}));
