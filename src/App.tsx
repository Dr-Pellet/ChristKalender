import { useState, useMemo, createContext } from 'react';

// =============================================
// TYPEN
// =============================================
type HolidayCategory =
  | 'hochfest'
  | 'fastenzeit'
  | 'ostern'
  | 'pfingsten'
  | 'advent'
  | 'weihnachten'
  | 'gedenktag'
  | 'evangelisch'
  | 'marienfest';

type Lang = 'de' | 'en';

interface ChristianHoliday {
  date: Date;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  category: HolidayCategory;
  emoji: string;
}

// =============================================
// ÜBERSETZUNGEN
// =============================================
const translations: Record<Lang, {
  monthNames: string[];
  weekdayShort: string[];
  categoryLabels: Record<HolidayCategory, string>;
  ui: Record<string, string>;
}> = {
  de: {
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ],
    weekdayShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    categoryLabels: {
      hochfest: 'Hochfest',
      fastenzeit: 'Fastenzeit',
      ostern: 'Ostern',
      pfingsten: 'Pfingsten',
      advent: 'Advent',
      weihnachten: 'Weihnachten',
      gedenktag: 'Gedenktag',
      evangelisch: 'Evangelisch',
      marienfest: 'Marienfest',
    },
    ui: {
      title: 'Christlicher Feiertagskalender',
      subtitle: 'Feste, Gedenktage & besondere Tage im Kirchenjahr',
      month: '📅 Monat',
      year: '📊 Jahr',
      filterCategories: 'Kategorien filtern',
      allHolidays: 'Alle Feiertage',
      entries: 'Einträge',
      today: 'Heute',
      todayBtn: '📍 Heute',
      nextHolidays: 'Nächste Feiertage',
      noMoreHolidays: 'Keine weiteren Feiertage in diesem Jahr',
      noHolidaysMonth: 'Keine Feiertage in diesem Monat',
      withActiveFilters: '(mit aktiven Filtern)',
      aboutTitle: 'Über den Kalender',
      aboutText: 'Dieser Kalender zeigt die wichtigsten christlichen Feiertage und Gedenktage. Bewegliche Feiertage wie Ostern werden automatisch berechnet. Enthält sowohl katholische als auch evangelische Feiertage.',
      easter: 'Ostern',
      holiday: 'Feiertag',
      holidays: 'Feiertage',
      daysLeft: 'Noch',
      day: 'Tag',
      days: 'Tage',
      ago: 'Vor',
      dayAgo: 'Tag',
      daysAgo: 'Tagen',
      inDays: 'in',
      footerPrefix: 'Christlicher Feiertagskalender · Kirchenjahr',
      footerSuffix: '· Bewegliche Feiertage basierend auf dem Osterdatum',
    },
  },
  en: {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekdayShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    categoryLabels: {
      hochfest: 'Solemnity',
      fastenzeit: 'Lent',
      ostern: 'Easter',
      pfingsten: 'Pentecost',
      advent: 'Advent',
      weihnachten: 'Christmas',
      gedenktag: 'Memorial Day',
      evangelisch: 'Protestant',
      marienfest: 'Marian Feast',
    },
    ui: {
      title: 'Christian Holiday Calendar',
      subtitle: 'Feasts, memorial days & special days in the liturgical year',
      month: '📅 Month',
      year: '📊 Year',
      filterCategories: 'Filter categories',
      allHolidays: 'All holidays',
      entries: 'entries',
      today: 'Today',
      todayBtn: '📍 Today',
      nextHolidays: 'Upcoming holidays',
      noMoreHolidays: 'No more holidays this year',
      noHolidaysMonth: 'No holidays this month',
      withActiveFilters: '(with active filters)',
      aboutTitle: 'About this calendar',
      aboutText: 'This calendar shows the most important Christian holidays and memorial days. Moveable feasts like Easter are automatically calculated. Includes both Catholic and Protestant holidays.',
      easter: 'Easter',
      holiday: 'holiday',
      holidays: 'holidays',
      daysLeft: 'In',
      day: 'day',
      days: 'days',
      ago: '',
      dayAgo: 'day ago',
      daysAgo: 'days ago',
      inDays: 'in',
      footerPrefix: 'Christian Holiday Calendar · Liturgical Year',
      footerSuffix: '· Moveable feasts based on the Easter date',
    },
  },
};

// =============================================
// LANGUAGE CONTEXT
// =============================================
const LangContext = createContext<{ lang: Lang; t: typeof translations['de'] }>({
  lang: 'de',
  t: translations.de,
});

// useLang hook available for child components
// function useLang() { return useContext(LangContext); }

// =============================================
// KONSTANTEN (sprachunabhängig)
// =============================================
const categoryStyle: Record<HolidayCategory, { color: string; bg: string; border: string }> = {
  hochfest: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  fastenzeit: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300' },
  ostern: { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  pfingsten: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
  advent: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  weihnachten: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  gedenktag: { color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-300' },
  evangelisch: { color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-300' },
  marienfest: { color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-300' },
};

const categoryDotColor: Record<HolidayCategory, string> = {
  hochfest: 'bg-amber-500',
  fastenzeit: 'bg-purple-500',
  ostern: 'bg-yellow-500',
  pfingsten: 'bg-red-500',
  advent: 'bg-blue-500',
  weihnachten: 'bg-green-500',
  gedenktag: 'bg-slate-500',
  evangelisch: 'bg-teal-500',
  marienfest: 'bg-sky-500',
};

// =============================================
// HILFSFUNKTIONEN
// =============================================
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const ii = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * ii - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getAdventSundays(year: number): Date[] {
  const christmas = new Date(year, 11, 25);
  const dec25Day = christmas.getDay();
  const fourthAdvent = new Date(year, 11, 25 - (dec25Day === 0 ? 7 : dec25Day));
  return [
    addDays(fourthAdvent, -21),
    addDays(fourthAdvent, -14),
    addDays(fourthAdvent, -7),
    fourthAdvent,
  ];
}

function getTotensonntag(year: number): Date {
  return addDays(getAdventSundays(year)[0], -7);
}

function getBussUndBettag(year: number): Date {
  return addDays(getTotensonntag(year), -4);
}

function getErntedankfest(year: number): Date {
  const oct1 = new Date(year, 9, 1);
  const day = oct1.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  return new Date(year, 9, 1 + daysUntilSunday);
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatDayMonth(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    day: 'numeric',
    month: 'short',
  });
}

function formatTodayDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// =============================================
// FEIERTAGE GENERIEREN
// =============================================
function getHolidaysForYear(year: number): ChristianHoliday[] {
  const easter = calculateEaster(year);
  const advents = getAdventSundays(year);
  const totensonntag = getTotensonntag(year);
  const bussUndBettag = getBussUndBettag(year);
  const erntedankfest = getErntedankfest(year);

  const holidays: ChristianHoliday[] = [
    // === FESTE FEIERTAGE ===
    {
      date: new Date(year, 0, 1),
      name: {
        de: 'Neujahr / Hochfest der Gottesmutter',
        en: 'New Year / Solemnity of Mary, Mother of God',
      },
      description: {
        de: 'Hochfest der Gottesmutter Maria. Die Kirche feiert die besondere Rolle Marias als Mutter Gottes. Gleichzeitig Weltfriedenstag.',
        en: 'Solemnity of Mary, Mother of God. The Church celebrates Mary\'s special role as the Mother of God. Also World Day of Peace.',
      },
      category: 'marienfest',
      emoji: '🙏',
    },
    {
      date: new Date(year, 0, 6),
      name: {
        de: 'Heilige Drei Könige (Epiphanie)',
        en: 'Epiphany (Three Kings\' Day)',
      },
      description: {
        de: 'Fest der Erscheinung des Herrn. Die Weisen aus dem Morgenland huldigen dem neugeborenen Jesus mit Gold, Weihrauch und Myrrhe.',
        en: 'Feast of the Apparition of the Lord. The Wise Men from the East pay homage to the newborn Jesus with gold, frankincense, and myrrh.',
      },
      category: 'weihnachten',
      emoji: '⭐',
    },
    {
      date: new Date(year, 1, 2),
      name: {
        de: 'Mariä Lichtmess',
        en: 'Candlemas (Presentation of the Lord)',
      },
      description: {
        de: 'Darstellung des Herrn im Tempel. 40 Tage nach Weihnachten wird Jesus im Tempel vorgestellt. Traditionell das Ende der Weihnachtszeit.',
        en: 'Presentation of the Lord in the Temple. 40 days after Christmas, Jesus is presented in the Temple. Traditionally marks the end of the Christmas season.',
      },
      category: 'marienfest',
      emoji: '🕯️',
    },
    {
      date: new Date(year, 2, 19),
      name: {
        de: 'Fest des Heiligen Josef',
        en: 'Feast of Saint Joseph',
      },
      description: {
        de: 'Gedenktag des heiligen Josef, des Nährvaters Jesu und Bräutigam Marias. Schutzpatron der Arbeiter und der Kirche.',
        en: 'Memorial day of Saint Joseph, foster father of Jesus and spouse of Mary. Patron saint of workers and the Church.',
      },
      category: 'gedenktag',
      emoji: '🪚',
    },
    {
      date: new Date(year, 2, 25),
      name: {
        de: 'Verkündigung des Herrn',
        en: 'Annunciation of the Lord',
      },
      description: {
        de: 'Der Erzengel Gabriel verkündet Maria, dass sie den Sohn Gottes empfangen wird. Neun Monate vor Weihnachten.',
        en: 'The Archangel Gabriel announces to Mary that she will conceive the Son of God. Nine months before Christmas.',
      },
      category: 'marienfest',
      emoji: '👼',
    },
    {
      date: new Date(year, 5, 24),
      name: {
        de: 'Geburt Johannes des Täufers',
        en: 'Nativity of Saint John the Baptist',
      },
      description: {
        de: 'Hochfest der Geburt des Johannes des Täufers, der als Vorläufer und Wegbereiter Jesu gilt.',
        en: 'Solemnity of the birth of John the Baptist, who is regarded as the forerunner and precursor of Jesus.',
      },
      category: 'hochfest',
      emoji: '🐚',
    },
    {
      date: new Date(year, 5, 29),
      name: {
        de: 'Peter und Paul',
        en: 'Saints Peter and Paul',
      },
      description: {
        de: 'Hochfest der Apostel Petrus und Paulus. Petrus als erster Papst und Paulus als Völkerapostel sind Säulen der Kirche.',
        en: 'Solemnity of the Apostles Peter and Paul. Peter as the first Pope and Paul as the Apostle to the Gentiles are pillars of the Church.',
      },
      category: 'hochfest',
      emoji: '🗝️',
    },
    {
      date: new Date(year, 7, 6),
      name: {
        de: 'Verklärung des Herrn',
        en: 'Transfiguration of the Lord',
      },
      description: {
        de: 'Jesus zeigt sich den Jüngern Petrus, Jakobus und Johannes auf dem Berg Tabor in göttlichem Licht.',
        en: 'Jesus reveals himself to the disciples Peter, James, and John on Mount Tabor in divine light.',
      },
      category: 'hochfest',
      emoji: '✨',
    },
    {
      date: new Date(year, 7, 15),
      name: {
        de: 'Mariä Himmelfahrt',
        en: 'Assumption of Mary',
      },
      description: {
        de: 'Aufnahme Marias in den Himmel mit Leib und Seele. Eines der höchsten Marienfeste der katholischen Kirche.',
        en: 'The assumption of Mary into heaven, body and soul. One of the highest Marian feasts of the Catholic Church.',
      },
      category: 'marienfest',
      emoji: '☁️',
    },
    {
      date: new Date(year, 8, 14),
      name: {
        de: 'Kreuzerhöhung',
        en: 'Exaltation of the Holy Cross',
      },
      description: {
        de: 'Fest zur Verehrung des Heiligen Kreuzes. Erinnert an die Auffindung des Kreuzes Christi durch die heilige Helena.',
        en: 'Feast of the veneration of the Holy Cross. Commemorates the finding of the Cross of Christ by Saint Helena.',
      },
      category: 'gedenktag',
      emoji: '✝️',
    },
    {
      date: new Date(year, 8, 29),
      name: {
        de: 'Erzengelfest (Michael, Gabriel, Raphael)',
        en: 'Feast of the Archangels (Michael, Gabriel, Raphael)',
      },
      description: {
        de: 'Fest der drei Erzengel Michael, Gabriel und Raphael. Michael als Beschützer, Gabriel als Bote, Raphael als Heiler.',
        en: 'Feast of the three Archangels Michael, Gabriel, and Raphael. Michael as protector, Gabriel as messenger, Raphael as healer.',
      },
      category: 'gedenktag',
      emoji: '😇',
    },
    {
      date: new Date(year, 9, 4),
      name: {
        de: 'Fest des Heiligen Franziskus',
        en: 'Feast of Saint Francis of Assisi',
      },
      description: {
        de: 'Gedenktag des heiligen Franz von Assisi (1181/82–1226), Gründer des Franziskanerordens, Patron der Tiere und der Umwelt.',
        en: 'Memorial day of Saint Francis of Assisi (1181/82–1226), founder of the Franciscan Order, patron of animals and the environment.',
      },
      category: 'gedenktag',
      emoji: '🐦',
    },
    {
      date: new Date(year, 9, 31),
      name: {
        de: 'Reformationstag',
        en: 'Reformation Day',
      },
      description: {
        de: 'Am 31. Oktober 1517 schlug Martin Luther seine 95 Thesen an die Schlosskirche zu Wittenberg. Beginn der Reformation.',
        en: 'On October 31, 1517, Martin Luther posted his 95 Theses on the door of the Castle Church in Wittenberg. The beginning of the Reformation.',
      },
      category: 'evangelisch',
      emoji: '📜',
    },
    {
      date: new Date(year, 10, 1),
      name: {
        de: 'Allerheiligen',
        en: 'All Saints\' Day',
      },
      description: {
        de: 'Gedenktag aller Heiligen, auch der unbekannten. Die Kirche ehrt alle, die in der Gemeinschaft Gottes vollendet sind.',
        en: 'Memorial day of all saints, including the unknown ones. The Church honors all who have been perfected in communion with God.',
      },
      category: 'hochfest',
      emoji: '👑',
    },
    {
      date: new Date(year, 10, 2),
      name: {
        de: 'Allerseelen',
        en: 'All Souls\' Day',
      },
      description: {
        de: 'Gedenktag aller verstorbenen Gläubigen. Die Kirche betet für die Verstorbenen und gedenkt ihrer.',
        en: 'Commemoration of all the faithful departed. The Church prays for the deceased and remembers them.',
      },
      category: 'gedenktag',
      emoji: '🕯️',
    },
    {
      date: new Date(year, 10, 11),
      name: {
        de: 'St. Martin',
        en: 'Saint Martin\'s Day',
      },
      description: {
        de: 'Gedenktag des heiligen Martin von Tours. Er teilte seinen Mantel mit einem frierenden Bettler. Laternenumzüge für Kinder.',
        en: 'Memorial day of Saint Martin of Tours. He shared his cloak with a freezing beggar. Lantern processions for children.',
      },
      category: 'gedenktag',
      emoji: '🏮',
    },
    {
      date: new Date(year, 11, 6),
      name: {
        de: 'Nikolaustag',
        en: 'Saint Nicholas Day',
      },
      description: {
        de: 'Gedenktag des heiligen Nikolaus von Myra, bekannt für seine Großzügigkeit und Nächstenliebe. Kinder stellen Stiefel vor die Tür.',
        en: 'Memorial day of Saint Nicholas of Myra, known for his generosity and charity. Children place boots at the door.',
      },
      category: 'gedenktag',
      emoji: '🎅',
    },
    {
      date: new Date(year, 11, 8),
      name: {
        de: 'Mariä Empfängnis',
        en: 'Immaculate Conception',
      },
      description: {
        de: 'Hochfest der ohne Erbsünde empfangenen Jungfrau Maria. Dogma der Unbefleckten Empfängnis.',
        en: 'Solemnity of the Immaculate Conception of the Blessed Virgin Mary. Dogma of the Immaculate Conception.',
      },
      category: 'marienfest',
      emoji: '💙',
    },
    {
      date: new Date(year, 11, 24),
      name: {
        de: 'Heiligabend',
        en: 'Christmas Eve',
      },
      description: {
        de: 'Vorabend von Weihnachten. Familien versammeln sich zur Bescherung und besuchen die Christmette.',
        en: 'The evening before Christmas. Families gather for gift-giving and attend Midnight Mass.',
      },
      category: 'weihnachten',
      emoji: '🌟',
    },
    {
      date: new Date(year, 11, 25),
      name: {
        de: '1. Weihnachtstag',
        en: 'Christmas Day',
      },
      description: {
        de: 'Hochfest der Geburt Jesu Christi. Die Menschwerdung Gottes wird gefeiert. „Und das Wort ist Fleisch geworden."',
        en: 'Solemnity of the Nativity of Jesus Christ. The incarnation of God is celebrated. "And the Word became flesh."',
      },
      category: 'weihnachten',
      emoji: '🎄',
    },
    {
      date: new Date(year, 11, 26),
      name: {
        de: '2. Weihnachtstag (Stephanstag)',
        en: 'Saint Stephen\'s Day (Boxing Day)',
      },
      description: {
        de: 'Gedenktag des heiligen Stephanus, des ersten Märtyrers der Christenheit. Zweiter Feiertag der Weihnachtszeit.',
        en: 'Memorial day of Saint Stephen, the first martyr of Christianity. Second day of Christmas.',
      },
      category: 'weihnachten',
      emoji: '🎁',
    },
    {
      date: new Date(year, 11, 31),
      name: {
        de: 'Silvester / Jahresschluss',
        en: 'New Year\'s Eve / Year\'s End',
      },
      description: {
        de: 'Letzter Tag des Jahres. Benannt nach Papst Silvester I. Jahresschlussgottesdienste und Dank für das vergangene Jahr.',
        en: 'Last day of the year. Named after Pope Sylvester I. Year-end church services and gratitude for the past year.',
      },
      category: 'gedenktag',
      emoji: '🔔',
    },

    // === BEWEGLICHE FEIERTAGE (Ostern-basiert) ===
    {
      date: addDays(easter, -52),
      name: {
        de: 'Sonntag Sexagesimae',
        en: 'Sexagesima Sunday',
      },
      description: {
        de: 'Zweiter Sonntag vor der Fastenzeit. Die Lesungen bereiten auf die bevorstehende Bußzeit vor.',
        en: 'Second Sunday before Lent. The readings prepare for the upcoming season of penance.',
      },
      category: 'fastenzeit',
      emoji: '📖',
    },
    {
      date: addDays(easter, -48),
      name: {
        de: 'Weiberfastnacht',
        en: 'Women\'s Carnival Thursday',
      },
      description: {
        de: 'Donnerstag vor Aschermittwoch, Beginn des Straßenkarnevals. Im Rheinland traditionell schneiden Frauen den Männern die Krawatten ab.',
        en: 'Thursday before Ash Wednesday, start of street carnival. In the Rhineland, women traditionally cut off men\'s ties.',
      },
      category: 'fastenzeit',
      emoji: '🎭',
    },
    {
      date: addDays(easter, -47),
      name: {
        de: 'Karnevalsfreitag',
        en: 'Carnival Friday',
      },
      description: {
        de: 'Freitag vor Aschermittwoch. Die Karnevalstage erreichen ihren Höhepunkt.',
        en: 'Friday before Ash Wednesday. The carnival days reach their climax.',
      },
      category: 'fastenzeit',
      emoji: '🎪',
    },
    {
      date: addDays(easter, -46),
      name: {
        de: 'Aschermittwoch',
        en: 'Ash Wednesday',
      },
      description: {
        de: 'Beginn der 40-tägigen Fastenzeit vor Ostern. Das Aschekreuz erinnert an die Vergänglichkeit: „Bedenke Mensch, dass du Staub bist."',
        en: 'Beginning of the 40-day Lenten season before Easter. The ash cross reminds us of mortality: "Remember that you are dust."',
      },
      category: 'fastenzeit',
      emoji: '✟',
    },
    {
      date: addDays(easter, -7),
      name: {
        de: 'Palmsonntag',
        en: 'Palm Sunday',
      },
      description: {
        de: 'Beginn der Karwoche. Jesus zieht in Jerusalem ein und wird mit Palmzweigen begrüßt. Palmweihe und Prozessionen.',
        en: 'Beginning of Holy Week. Jesus enters Jerusalem and is greeted with palm branches. Blessing of palms and processions.',
      },
      category: 'ostern',
      emoji: '🌿',
    },
    {
      date: addDays(easter, -3),
      name: {
        de: 'Gründonnerstag',
        en: 'Maundy Thursday (Holy Thursday)',
      },
      description: {
        de: 'Gedenken an das Letzte Abendmahl Jesu mit seinen Jüngern. Einsetzung der Eucharistie und des Priestertums. Fußwaschung.',
        en: 'Commemoration of the Last Supper of Jesus with his disciples. Institution of the Eucharist and the priesthood. Washing of the feet.',
      },
      category: 'ostern',
      emoji: '🍷',
    },
    {
      date: addDays(easter, -2),
      name: {
        de: 'Karfreitag',
        en: 'Good Friday',
      },
      description: {
        de: 'Höchster evangelischer Feiertag. Gedenken an die Kreuzigung und den Tod Jesu Christi. Tag der Stille und Besinnung.',
        en: 'Highest Protestant holiday. Commemoration of the crucifixion and death of Jesus Christ. A day of silence and reflection.',
      },
      category: 'ostern',
      emoji: '✝️',
    },
    {
      date: addDays(easter, -1),
      name: {
        de: 'Karsamstag / Ostersamstag',
        en: 'Holy Saturday',
      },
      description: {
        de: 'Tag der Grabesruhe Christi. Stille und Erwartung. Am Abend wird die Osternacht gefeiert mit Osterfeuer und Tauferneuerung.',
        en: 'Day of Christ\'s rest in the tomb. Silence and anticipation. In the evening, the Easter Vigil is celebrated with the Easter fire and renewal of baptismal vows.',
      },
      category: 'ostern',
      emoji: '🪨',
    },
    {
      date: easter,
      name: {
        de: 'Ostersonntag',
        en: 'Easter Sunday',
      },
      description: {
        de: 'Das höchste Fest der Christenheit! Feier der Auferstehung Jesu Christi von den Toten. „Er ist wahrhaft auferstanden!"',
        en: 'The highest feast of Christianity! Celebration of the Resurrection of Jesus Christ from the dead. "He is truly risen!"',
      },
      category: 'ostern',
      emoji: '🐣',
    },
    {
      date: addDays(easter, 1),
      name: {
        de: 'Ostermontag',
        en: 'Easter Monday',
      },
      description: {
        de: 'Zweiter Ostertag. Die Emmaus-Jünger erkennen den auferstandenen Christus beim Brotbrechen.',
        en: 'Second day of Easter. The disciples at Emmaus recognize the risen Christ in the breaking of bread.',
      },
      category: 'ostern',
      emoji: '🌷',
    },
    {
      date: addDays(easter, 39),
      name: {
        de: 'Christi Himmelfahrt',
        en: 'Ascension of Christ',
      },
      description: {
        de: 'Jesus Christus fährt 40 Tage nach Ostern in den Himmel auf und sitzt zur Rechten Gottes. Auch Vatertag.',
        en: 'Jesus Christ ascends to heaven 40 days after Easter and sits at the right hand of God. Also Father\'s Day in Germany.',
      },
      category: 'hochfest',
      emoji: '☁️',
    },
    {
      date: addDays(easter, 49),
      name: {
        de: 'Pfingstsonntag',
        en: 'Pentecost Sunday (Whitsunday)',
      },
      description: {
        de: 'Ausgießung des Heiligen Geistes auf die Jünger. Geburtsstunde der Kirche. 50 Tage nach Ostern.',
        en: 'Outpouring of the Holy Spirit upon the disciples. Birthday of the Church. 50 days after Easter.',
      },
      category: 'pfingsten',
      emoji: '🔥',
    },
    {
      date: addDays(easter, 50),
      name: {
        de: 'Pfingstmontag',
        en: 'Whit Monday',
      },
      description: {
        de: 'Zweiter Pfingsttag. Die Gemeinde feiert das Wirken des Heiligen Geistes in der Welt.',
        en: 'Second day of Pentecost. The congregation celebrates the work of the Holy Spirit in the world.',
      },
      category: 'pfingsten',
      emoji: '🕊️',
    },
    {
      date: addDays(easter, 56),
      name: {
        de: 'Dreifaltigkeitssonntag (Trinitatis)',
        en: 'Trinity Sunday',
      },
      description: {
        de: 'Fest der Heiligen Dreifaltigkeit: Gott als Vater, Sohn und Heiliger Geist. Grundlage des christlichen Glaubens.',
        en: 'Feast of the Holy Trinity: God as Father, Son, and Holy Spirit. Foundation of the Christian faith.',
      },
      category: 'hochfest',
      emoji: '🔺',
    },
    {
      date: addDays(easter, 60),
      name: {
        de: 'Fronleichnam',
        en: 'Corpus Christi',
      },
      description: {
        de: 'Hochfest des Leibes und Blutes Christi. Feierliche Prozessionen mit der Monstranz durch die Straßen (katholisch).',
        en: 'Solemnity of the Body and Blood of Christ. Solemn processions with the monstrance through the streets (Catholic).',
      },
      category: 'hochfest',
      emoji: '☀️',
    },
    {
      date: addDays(easter, 68),
      name: {
        de: 'Herz-Jesu-Fest',
        en: 'Feast of the Sacred Heart',
      },
      description: {
        de: 'Verehrung des heiligsten Herzens Jesu. Symbol der göttlichen Liebe zu den Menschen.',
        en: 'Veneration of the Most Sacred Heart of Jesus. Symbol of divine love for humanity.',
      },
      category: 'hochfest',
      emoji: '❤️',
    },

    // === ADVENT ===
    {
      date: advents[0],
      name: {
        de: '1. Advent',
        en: 'First Sunday of Advent',
      },
      description: {
        de: 'Beginn des Kirchenjahres und der Adventszeit. Die erste Kerze am Adventskranz wird entzündet. Zeit der Erwartung und Vorbereitung auf Weihnachten.',
        en: 'Beginning of the liturgical year and Advent season. The first candle on the Advent wreath is lit. A time of expectation and preparation for Christmas.',
      },
      category: 'advent',
      emoji: '🕯️',
    },
    {
      date: advents[1],
      name: {
        de: '2. Advent',
        en: 'Second Sunday of Advent',
      },
      description: {
        de: 'Die zweite Kerze am Adventskranz wird entzündet. Die Vorfreude auf Weihnachten wächst.',
        en: 'The second candle on the Advent wreath is lit. The anticipation for Christmas grows.',
      },
      category: 'advent',
      emoji: '🕯️',
    },
    {
      date: advents[2],
      name: {
        de: '3. Advent (Gaudete)',
        en: 'Third Sunday of Advent (Gaudete)',
      },
      description: {
        de: 'Freudensonntag – „Gaudete" (Freuet euch!). Rose Kerze und rose Messgewand als Zeichen der Vorfreude.',
        en: 'Sunday of Joy – "Gaudete" (Rejoice!). Rose candle and rose vestments as a sign of joyful anticipation.',
      },
      category: 'advent',
      emoji: '🕯️',
    },
    {
      date: advents[3],
      name: {
        de: '4. Advent',
        en: 'Fourth Sunday of Advent',
      },
      description: {
        de: 'Die vierte und letzte Kerze am Adventskranz wird entzündet. Weihnachten steht unmittelbar bevor.',
        en: 'The fourth and last candle on the Advent wreath is lit. Christmas is imminent.',
      },
      category: 'advent',
      emoji: '🕯️',
    },

    // === SONDERTAGE ===
    {
      date: erntedankfest,
      name: {
        de: 'Erntedankfest',
        en: 'Harvest Thanksgiving',
      },
      description: {
        de: 'Dank an Gott für die Ernte und die Gaben der Natur. Festlich geschmückte Kirchen mit Erntegaben.',
        en: 'Thanksgiving to God for the harvest and the gifts of nature. Festively decorated churches with harvest offerings.',
      },
      category: 'gedenktag',
      emoji: '🌾',
    },
    {
      date: bussUndBettag,
      name: {
        de: 'Buß- und Bettag',
        en: 'Day of Repentance and Prayer',
      },
      description: {
        de: 'Evangelischer Feiertag. Tag der Besinnung, Buße und des Gebets. In Sachsen gesetzlicher Feiertag.',
        en: 'Protestant holiday. A day of reflection, repentance, and prayer. A public holiday in Saxony, Germany.',
      },
      category: 'evangelisch',
      emoji: '🙏',
    },
    {
      date: totensonntag,
      name: {
        de: 'Totensonntag (Ewigkeitssonntag)',
        en: 'Sunday of the Dead (Eternity Sunday)',
      },
      description: {
        de: 'Evangelischer Gedenktag für die Verstorbenen. Letzter Sonntag des Kirchenjahres. Stiller Feiertag.',
        en: 'Protestant memorial day for the deceased. Last Sunday of the liturgical year. A quiet holiday.',
      },
      category: 'evangelisch',
      emoji: '🕊️',
    },
  ];

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// =============================================
// KALENDER-HILFSFUNKTIONEN
// =============================================
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

// =============================================
// SPRACH-UMSCHALTER KOMPONENTE
// =============================================
function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
      <button
        onClick={() => setLang('de')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          lang === 'de'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Deutsch"
      >
        <span className="text-sm">🇩🇪</span> DE
      </button>
      <button
        onClick={() => setLang('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          lang === 'en'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="English"
      >
        <span className="text-sm">🇬🇧</span> EN
      </button>
    </div>
  );
}

// =============================================
// HAUPT-KOMPONENTE
// =============================================
function App() {
  const today = new Date();
  const [lang, setLang] = useState<Lang>('de');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedHoliday, setSelectedHoliday] = useState<ChristianHoliday | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<HolidayCategory>>(
    new Set(Object.keys(categoryStyle) as HolidayCategory[])
  );
  const [view, setView] = useState<'month' | 'year'>('month');

  const t = translations[lang];

  const allHolidays = useMemo(() => getHolidaysForYear(currentYear), [currentYear]);

  const holidayMap = useMemo(() => {
    const map = new Map<string, ChristianHoliday[]>();
    for (const h of allHolidays) {
      const key = dateKey(h.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(h);
    }
    return map;
  }, [allHolidays]);

  const monthHolidays = useMemo(
    () =>
      allHolidays.filter(
        (h) =>
          h.date.getMonth() === currentMonth && activeCategories.has(h.category)
      ),
    [allHolidays, currentMonth, activeCategories]
  );

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedHoliday(null);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedHoliday(null);
  };

  const toggleCategory = (cat: HolidayCategory) => {
    const next = new Set(activeCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setActiveCategories(next);
  };

  const isToday = (day: number, month: number, year: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const getUpcomingHolidays = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return allHolidays
      .filter((h) => h.date >= now && activeCategories.has(h.category))
      .slice(0, 5);
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderCountdown = (diff: number) => {
    if (diff === 0)
      return (
        <div className="mt-4 p-3 bg-green-50 rounded-xl text-green-700 text-sm font-medium text-center">
          🎉 {t.ui.today}!
        </div>
      );
    if (diff > 0)
      return (
        <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-indigo-600 text-sm text-center">
          ⏳ {t.ui.daysLeft} <span className="font-bold">{diff}</span> {diff !== 1 ? t.ui.days : t.ui.day}
        </div>
      );
    const absDiff = Math.abs(diff);
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-gray-500 text-sm text-center">
        {lang === 'de'
          ? `Vor ${absDiff} ${absDiff !== 1 ? 'Tagen' : 'Tag'}`
          : `${absDiff} ${absDiff !== 1 ? t.ui.daysAgo : t.ui.dayAgo}`}
      </div>
    );
  };

  const renderUpcomingLabel = (diff: number) => {
    if (diff === 0) return t.ui.today;
    if (lang === 'de') return `in ${diff} ${diff !== 1 ? 'Tagen' : 'Tag'}`;
    return `in ${diff} ${diff !== 1 ? 'days' : 'day'}`;
  };

  const renderMiniMonth = (month: number) => {
    const days = getCalendarDays(currentYear, month);
    return (
      <div
        key={month}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          setCurrentMonth(month);
          setView('month');
        }}
      >
        <h4 className="text-sm font-bold text-gray-700 mb-2 text-center">{t.monthNames[month]}</h4>
        <div className="grid grid-cols-7 gap-0">
          {t.weekdayShort.map((d) => (
            <div key={d} className="text-[9px] text-gray-400 text-center font-medium">
              {d}
            </div>
          ))}
          {days.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} className="h-5" />;
            const key = dateKey(new Date(currentYear, month, day));
            const dayHolidays = (holidayMap.get(key) || []).filter((h) =>
              activeCategories.has(h.category)
            );
            const hasHoliday = dayHolidays.length > 0;
            const todayMatch = isToday(day, month, currentYear);
            return (
              <div
                key={`d-${i}`}
                className={`h-5 flex items-center justify-center text-[10px] rounded-sm
                  ${todayMatch ? 'bg-indigo-600 text-white font-bold' : ''}
                  ${hasHoliday && !todayMatch ? 'font-bold' : ''}
                  ${!hasHoliday && !todayMatch ? 'text-gray-500' : ''}
                `}
              >
                {hasHoliday && !todayMatch ? (
                  <span className="relative">
                    <span className={categoryStyle[dayHolidays[0].category].color}>
                      {day}
                    </span>
                    <span
                      className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${categoryDotColor[dayHolidays[0].category]}`}
                    />
                  </span>
                ) : (
                  day
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                  ✝
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{t.ui.title}</h1>
                  <p className="text-xs text-gray-500">{t.ui.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <LanguageToggle lang={lang} setLang={setLang} />
                <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'month'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t.ui.month}
                </button>
                <button
                  onClick={() => setView('year')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'year'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t.ui.year}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Category Filter */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t.ui.filterCategories}</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryStyle) as HolidayCategory[]).map((cat) => {
                const cs = categoryStyle[cat];
                const isActive = activeCategories.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isActive
                        ? `${cs.bg} ${cs.color} ${cs.border} shadow-sm`
                        : 'bg-gray-50 text-gray-400 border-gray-200 opacity-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? categoryDotColor[cat] : 'bg-gray-300'}`} />
                    {t.categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {view === 'year' ? (
            /* ===== YEAR VIEW ===== */
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => { setCurrentYear(currentYear - 1); setSelectedHoliday(null); }}
                  className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >
                  ‹
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{currentYear}</h2>
                <button
                  onClick={() => { setCurrentYear(currentYear + 1); setSelectedHoliday(null); }}
                  className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
              </div>
              {/* Full year holiday list */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {t.ui.allHolidays} {currentYear}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({allHolidays.filter((h) => activeCategories.has(h.category)).length} {t.ui.entries})
                  </span>
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {allHolidays
                    .filter((h) => activeCategories.has(h.category))
                    .map((holiday, i) => {
                      const cs = categoryStyle[holiday.category];
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedHoliday(holiday)}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                            selectedHoliday === holiday
                              ? `${cs.bg} ${cs.border} shadow-sm`
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <span className="text-xl w-8 text-center shrink-0">{holiday.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-800 truncate">{holiday.name[lang]}</div>
                            <div className="text-xs text-gray-500">
                              {formatShortDate(holiday.date, lang)}
                            </div>
                          </div>
                          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full ${cs.bg} ${cs.color} font-medium`}>
                            {t.categoryLabels[holiday.category]}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            /* ===== MONTH VIEW ===== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <button
                      onClick={prevMonth}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
                    >
                      ‹
                    </button>
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-gray-800">
                        {t.monthNames[currentMonth]} {currentYear}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {monthHolidays.length} {monthHolidays.length !== 1 ? t.ui.holidays : t.ui.holiday}
                      </p>
                    </div>
                    <button
                      onClick={nextMonth}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
                    >
                      ›
                    </button>
                  </div>

                  {/* Year quick nav */}
                  <div className="flex items-center justify-center gap-1 py-2 border-b border-gray-50 bg-gray-50/50">
                    <button
                      onClick={() => { setCurrentYear(currentYear - 1); setSelectedHoliday(null); }}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      « {currentYear - 1}
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full">
                      {currentYear}
                    </span>
                    <button
                      onClick={() => { setCurrentYear(currentYear + 1); setSelectedHoliday(null); }}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {currentYear + 1} »
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-7 mb-2">
                      {t.weekdayShort.map((d) => (
                        <div
                          key={d}
                          className="text-center text-xs font-semibold text-gray-400 py-2"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, i) => {
                        if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;

                        const key = dateKey(new Date(currentYear, currentMonth, day));
                        const dayHolidays = (holidayMap.get(key) || []).filter((h) =>
                          activeCategories.has(h.category)
                        );
                        const hasHoliday = dayHolidays.length > 0;
                        const todayMatch = isToday(day, currentMonth, currentYear);
                        const isSelected =
                          selectedHoliday &&
                          selectedHoliday.date.getDate() === day &&
                          selectedHoliday.date.getMonth() === currentMonth;
                        const isSunday = (i + 1) % 7 === 0;

                        return (
                          <button
                            key={`day-${day}`}
                            onClick={() => {
                              if (hasHoliday) setSelectedHoliday(dayHolidays[0]);
                            }}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all text-sm
                              ${todayMatch ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-bold ring-2 ring-indigo-300' : ''}
                              ${isSelected && !todayMatch ? 'bg-indigo-50 ring-2 ring-indigo-300' : ''}
                              ${hasHoliday && !todayMatch && !isSelected ? 'hover:bg-gray-50 cursor-pointer font-semibold' : ''}
                              ${!hasHoliday && !todayMatch ? 'text-gray-600 hover:bg-gray-50' : ''}
                              ${isSunday && !todayMatch && !isSelected ? 'text-red-400' : ''}
                            `}
                          >
                            <span className={hasHoliday && !todayMatch ? 'text-gray-800' : ''}>
                              {day}
                            </span>
                            {hasHoliday && (
                              <div className="flex gap-0.5 mt-0.5">
                                {dayHolidays.slice(0, 3).map((h, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      todayMatch ? 'bg-white/80' : categoryDotColor[h.category]
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Today button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setCurrentYear(today.getFullYear());
                      setCurrentMonth(today.getMonth());
                      setSelectedHoliday(null);
                    }}
                    className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {t.ui.todayBtn} ({formatTodayDate(today, lang)})
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Selected Holiday Detail */}
                {selectedHoliday && (
                  <div
                    className={`rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${
                      categoryStyle[selectedHoliday.category].border
                    }`}
                  >
                    <div className={`p-5 ${categoryStyle[selectedHoliday.category].bg}`}>
                      <div className="flex items-start justify-between">
                        <span className="text-4xl">{selectedHoliday.emoji}</span>
                        <button
                          onClick={() => setSelectedHoliday(null)}
                          className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mt-3">
                        {selectedHoliday.name[lang]}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(selectedHoliday.date, lang)}
                      </p>
                      <span
                        className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                          categoryStyle[selectedHoliday.category].bg
                        } ${categoryStyle[selectedHoliday.category].color} border ${
                          categoryStyle[selectedHoliday.category].border
                        }`}
                      >
                        {t.categoryLabels[selectedHoliday.category]}
                      </span>
                    </div>
                    <div className="bg-white p-5">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedHoliday.description[lang]}
                      </p>
                      {renderCountdown(getDaysUntil(selectedHoliday.date))}
                    </div>
                  </div>
                )}

                {/* Upcoming Holidays */}
                {currentYear === today.getFullYear() && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">📋</span> {t.ui.nextHolidays}
                    </h3>
                    <div className="space-y-2">
                      {getUpcomingHolidays().map((holiday, i) => {
                        const diff = getDaysUntil(holiday.date);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedHoliday(holiday);
                              setCurrentMonth(holiday.date.getMonth());
                            }}
                            className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-lg w-7 text-center">{holiday.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">
                                {holiday.name[lang]}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDayMonth(holiday.date, lang)}{' '}
                                · {renderUpcomingLabel(diff)}
                              </div>
                            </div>
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${categoryDotColor[holiday.category]}`}
                            />
                          </button>
                        );
                      })}
                      {getUpcomingHolidays().length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                          {t.ui.noMoreHolidays}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Month Holiday List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">📌</span> {t.monthNames[currentMonth]}
                  </h3>
                  {monthHolidays.length > 0 ? (
                    <div className="space-y-2">
                      {monthHolidays.map((holiday, i) => {
                        const cs = categoryStyle[holiday.category];
                        const isSel = selectedHoliday === holiday;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedHoliday(holiday)}
                            className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                              isSel
                                ? `${cs.bg} ${cs.border} border shadow-sm`
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <span className="text-lg w-7 text-center">{holiday.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">
                                {holiday.name[lang]}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatShortDate(holiday.date, lang)}
                              </div>
                            </div>
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${categoryDotColor[holiday.category]}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">📭</p>
                      <p className="text-sm text-gray-400">
                        {t.ui.noHolidaysMonth}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        {t.ui.withActiveFilters}
                      </p>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
                  <h3 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <span>ℹ️</span> {t.ui.aboutTitle}
                  </h3>
                  <p className="text-xs text-indigo-600/70 leading-relaxed">
                    {t.ui.aboutText}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-indigo-500">
                    <span>🥚</span>
                    <span>
                      {t.ui.easter} {currentYear}:{' '}
                      <strong>
                        {allHolidays
                          .find((h) => h.name.de === 'Ostersonntag')
                          ?.date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { day: 'numeric', month: 'long' })}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 bg-white/50">
          <p className="text-center text-xs text-gray-400">
            ✝️ {t.ui.footerPrefix} {currentYear} {t.ui.footerSuffix}
          </p>
        </footer>

        {/* Holiday detail modal for year view */}
        {view === 'year' && selectedHoliday && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHoliday(null)}
          >
            <div
              className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 ${
                categoryStyle[selectedHoliday.category].border
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 ${categoryStyle[selectedHoliday.category].bg}`}>
                <div className="flex items-start justify-between">
                  <span className="text-5xl">{selectedHoliday.emoji}</span>
                  <button
                    onClick={() => setSelectedHoliday(null)}
                    className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4">
                  {selectedHoliday.name[lang]}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedHoliday.date, lang)}
                </p>
                <span
                  className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium border ${
                    categoryStyle[selectedHoliday.category].bg
                  } ${categoryStyle[selectedHoliday.category].color} ${
                    categoryStyle[selectedHoliday.category].border
                  }`}
                >
                  {t.categoryLabels[selectedHoliday.category]}
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedHoliday.description[lang]}
                </p>
                {renderCountdown(getDaysUntil(selectedHoliday.date))}
              </div>
            </div>
          </div>
        )}
      </div>
    </LangContext.Provider>
  );
}

export default App;
