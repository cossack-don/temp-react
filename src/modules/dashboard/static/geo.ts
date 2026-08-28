export interface City {
  id: string
  label: string
}

export interface Country {
  id: string
  label: string
  cities: City[]
}

export interface Region {
  id: string
  label: string
  countries: Country[]
}

export const REGIONS: Region[] = [
  {
    id: 'eu',
    label: 'Европа',
    countries: [
      {
        id: 'de',
        label: 'Германия',
        cities: [
          { id: 'berlin', label: 'Берлин' },
          { id: 'munich', label: 'Мюнхен' },
          { id: 'hamburg', label: 'Гамбург' },
        ],
      },
      {
        id: 'es',
        label: 'Испания',
        cities: [
          { id: 'madrid', label: 'Мадрид' },
          { id: 'barcelona', label: 'Барселона' },
        ],
      },
    ],
  },
  {
    id: 'asia',
    label: 'Азия',
    countries: [
      {
        id: 'jp',
        label: 'Япония',
        cities: [
          { id: 'tokyo', label: 'Токио' },
          { id: 'osaka', label: 'Осака' },
        ],
      },
      {
        id: 'kz',
        label: 'Казахстан',
        cities: [
          { id: 'almaty', label: 'Алматы' },
          { id: 'astana', label: 'Астана' },
          { id: 'shymkent', label: 'Шымкент' },
        ],
      },
    ],
  },
  {
    id: 'am',
    label: 'Америка',
    countries: [
      {
        id: 'us',
        label: 'США',
        cities: [
          { id: 'nyc', label: 'Нью-Йорк' },
          { id: 'chicago', label: 'Чикаго' },
          { id: 'austin', label: 'Остин' },
        ],
      },
      {
        id: 'br',
        label: 'Бразилия',
        cities: [
          { id: 'sao-paulo', label: 'Сан-Паулу' },
          { id: 'rio', label: 'Рио-де-Жанейро' },
        ],
      },
    ],
  },
]

export interface Selection {
  region: Region
  country: Country
  city: City
}

/**
 * Каскад: значение уровня принимается только если оно принадлежит
 * выбранному родителю, иначе берётся первое доступное.
 * Так невалидного состояния в URL просто не существует.
 */
export function resolveSelection(
  regionId?: string,
  countryId?: string,
  cityId?: string,
): Selection {
  const region = REGIONS.find((item) => item.id === regionId) ?? REGIONS[0]!
  const country =
    region.countries.find((item) => item.id === countryId) ?? region.countries[0]!
  const city = country.cities.find((item) => item.id === cityId) ?? country.cities[0]!

  return { region, country, city }
}
