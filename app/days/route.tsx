import { ImageResponse } from "next/og"

export const runtime = "edge"

// Tech & Science events for each day of the year (month-day format)
const techScienceEvents: Record<string, string> = {
  "1-1": "1983: ARPANET transitions to TCP/IP, birth of the Internet",
  "1-2": "1959: Luna 1 becomes first spacecraft to reach Moon's vicinity",
  "1-3": "1977: Apple Computer is incorporated",
  "1-4": "2004: Spirit rover lands on Mars",
  "1-5": "1969: Venera 5 launched to Venus",
  "1-6": "1838: Samuel Morse first demonstrates telegraph",
  "1-7": "1927: First transatlantic phone call: New York to London",
  "1-8": "1889: Herman Hollerith patents tabulating machine",
  "1-9": "2007: Steve Jobs announces the first iPhone",
  "1-10": "1946: First radar signal bounced off the Moon",
  "1-11": "1964: US Surgeon General links smoking to cancer",
  "1-12": "2005: Deep Impact spacecraft launched to comet Tempel 1",
  "1-13": "1990: First ever Internet virus infected ARPANET",
  "1-14": "2005: Huygens probe lands on Saturn's moon Titan",
  "1-15": "2001: Wikipedia goes online",
  "1-16": "2003: Space Shuttle Columbia launches final mission",
  "1-17": "1949: First Volkswagen Beetle arrives in US",
  "1-18": "1896: First X-ray machine exhibited in the US",
  "1-19": "2006: New Horizons launches toward Pluto",
  "1-20": "1930: Edwin Aldrin, Apollo 11 astronaut, born",
  "1-21": "1954: First nuclear submarine USS Nautilus launched",
  "1-22": "1984: Apple Macintosh advertised during Super Bowl",
  "1-23": "1960: Bathyscaphe Trieste reaches deepest ocean point",
  "1-24": "1984: Apple Macintosh goes on sale",
  "1-25": "2004: Opportunity rover lands on Mars",
  "1-26": "1983: Lotus 1-2-3 spreadsheet released",
  "1-27": "1967: Apollo 1 fire tragedy at NASA",
  "1-28": "1986: Space Shuttle Challenger disaster",
  "1-29": "1886: Karl Benz patents first automobile",
  "1-30": "1969: Beatles perform rooftop concert",
  "1-31": "1958: Explorer 1, first US satellite, launched",
  "2-1": "2003: Space Shuttle Columbia breaks apart on reentry",
  "2-2": "1935: First polygraph lie detector test in court",
  "2-3": "1966: Soviet Luna 9 first soft landing on Moon",
  "2-4": "2004: Facebook founded by Mark Zuckerberg",
  "2-5": "1958: First US satellite, Explorer 1, finds Van Allen belts",
  "2-6": "1971: Alan Shepard plays golf on the Moon",
  "2-7": "1984: Bruce McCandless first untethered spacewalk",
  "2-8": "1974: Skylab astronauts return after 84 days",
  "2-9": "1996: Element 112 Copernicium first synthesized",
  "2-10": "1996: IBM Deep Blue defeats chess champion Kasparov",
  "2-11": "1970: Japan launches first satellite, Ohsumi",
  "2-12": "1809: Charles Darwin born, father of evolution",
  "2-13": "1633: Galileo arrives in Rome for Inquisition trial",
  "2-14": "1876: Bell and Gray file telephone patents same day",
  "2-15": "1989: GPS satellite system becomes fully operational",
  "2-16": "1978: First computer bulletin board system (BBS) created",
  "2-17": "2004: Scientists create new chemical elements 113 & 115",
  "2-18": "1930: Pluto discovered by Clyde Tombaugh",
  "2-19": "1986: Soviet space station Mir launched",
  "2-20": "1962: John Glenn orbits Earth, first American",
  "2-21": "1947: Edwin Land demonstrates Polaroid camera",
  "2-22": "1987: Supernova 1987A observed, nearest in 400 years",
  "2-23": "1997: Dolly the cloned sheep announced to world",
  "2-24": "1968: First pulsar discovered announced",
  "2-25": "1991: World Wide Web debuts to the public",
  "2-26": "1935: Robert Watson-Watt demonstrates radar",
  "2-27": "1940: Carbon-14 discovered, enables radiocarbon dating",
  "2-28": "1953: Watson and Crick discover DNA structure",
  "3-1": "1966: Venera 3 crashes on Venus, first to reach planet",
  "3-2": "1969: Concorde supersonic jet makes first flight",
  "3-3": "1847: Alexander Graham Bell born, inventor of telephone",
  "3-4": "1877: Emile Berliner invents microphone",
  "3-5": "1979: Voyager 1 makes closest approach to Jupiter",
  "3-6": "1899: Aspirin patented by Bayer",
  "3-7": "1876: Alexander Graham Bell patents telephone",
  "3-8": "1618: Johannes Kepler discovers third law of motion",
  "3-9": "1959: Barbie doll makes its debut",
  "3-10": "1876: First telephone call: 'Mr. Watson, come here'",
  "3-11": "2011: Fukushima nuclear disaster after earthquake",
  "3-12": "1989: Tim Berners-Lee proposes World Wide Web",
  "3-13": "1781: William Herschel discovers Uranus",
  "3-14": "1879: Albert Einstein born, Theory of Relativity",
  "3-15": "1985: First .com domain name registered",
  "3-16": "1926: Robert Goddard launches first liquid fuel rocket",
  "3-17": "1958: Vanguard 1 satellite launched, still in orbit",
  "3-18": "1965: Alexei Leonov performs first spacewalk",
  "3-19": "2008: Arthur C. Clarke dies, sci-fi visionary",
  "3-20": "2015: Total solar eclipse visible from Europe",
  "3-21": "2006: Twitter founded by Jack Dorsey",
  "3-22": "1993: Intel ships first Pentium processors",
  "3-23": "1983: President Reagan proposes Star Wars SDI",
  "3-24": "1882: Robert Koch announces discovery of TB bacteria",
  "3-25": "1655: Titan discovered by Christiaan Huygens",
  "3-26": "1953: Jonas Salk announces polio vaccine",
  "3-27": "1998: FDA approves Viagra",
  "3-28": "1979: Three Mile Island nuclear accident",
  "3-29": "1974: Mariner 10 makes first flyby of Mercury",
  "3-30": "1842: Ether first used as anesthetic in surgery",
  "3-31": "1889: Eiffel Tower officially opens in Paris",
  "4-1": "2004: Gmail launched by Google as invite-only",
  "4-2": "1935: Robert Watson-Watt patents radar",
  "4-3": "1973: First mobile phone call made by Martin Cooper",
  "4-4": "1975: Microsoft founded by Gates and Allen",
  "4-5": "1998: Akashi Kaikyo Bridge opens, longest suspension",
  "4-6": "1965: First commercial satellite Intelsat 1 launched",
  "4-7": "1969: RFC 1 published, foundation of Internet",
  "4-8": "1911: Heike Kamerlingh discovers superconductivity",
  "4-9": "1959: NASA announces Mercury Seven astronauts",
  "4-10": "1849: Safety pin patented by Walter Hunt",
  "4-11": "1970: Apollo 13 launches with famous malfunction",
  "4-12": "1961: Yuri Gagarin becomes first human in space",
  "4-13": "1970: Apollo 13: 'Houston, we have a problem'",
  "4-14": "1894: First commercial movie shown using Kinetoscope",
  "4-15": "1912: RMS Titanic sinks after hitting iceberg",
  "4-16": "1867: Wilbur Wright born, aviation pioneer",
  "4-17": "1964: Ford Mustang unveiled at World's Fair",
  "4-18": "1955: Albert Einstein dies at age 76",
  "4-19": "1971: Salyut 1 first space station launched",
  "4-20": "2010: Deepwater Horizon oil rig explosion",
  "4-21": "1997: First ever space burial conducted",
  "4-22": "1970: First Earth Day celebrated",
  "4-23": "2005: First YouTube video uploaded",
  "4-24": "1990: Hubble Space Telescope launched",
  "4-25": "1953: Watson & Crick publish DNA paper in Nature",
  "4-26": "1986: Chernobyl nuclear disaster",
  "4-27": "1981: First computer mouse sold by Xerox",
  "4-28": "2001: Dennis Tito first space tourist launches",
  "4-29": "1991: Cyclone kills 138,000 in Bangladesh",
  "4-30": "1993: CERN releases World Wide Web to public",
  "5-1": "1964: BASIC programming language runs first time",
  "5-2": "1999: First GPS satellite for civilians launched",
  "5-3": "1978: First spam email sent to ARPANET users",
  "5-4": "1989: Magellan probe launches toward Venus",
  "5-5": "1961: Alan Shepard first American in space",
  "5-6": "1994: Channel Tunnel between UK and France opens",
  "5-7": "1992: Space Shuttle Endeavour maiden flight",
  "5-8": "1886: Coca-Cola invented by Dr. John Pemberton",
  "5-9": "1960: FDA approves first birth control pill",
  "5-10": "1994: First ever web conference held",
  "5-11": "1997: IBM Deep Blue defeats Kasparov in chess match",
  "5-12": "1941: Konrad Zuse presents Z3, first computer",
  "5-13": "1958: Velcro trademark registered",
  "5-14": "1973: Skylab launched, first US space station",
  "5-15": "1957: First UK hydrogen bomb tested",
  "5-16": "1960: Theodore Maiman operates first laser",
  "5-17": "1954: Brown v Board of Education ruling",
  "5-18": "1980: Mount St. Helens erupts catastrophically",
  "5-19": "1971: Soviet Mars 2 orbiter launched",
  "5-20": "1983: First HIV-AIDS virus isolated",
  "5-21": "1904: FIFA (soccer federation) founded in Paris",
  "5-22": "1906: Wright Brothers receive airplane patent",
  "5-23": "1911: New York Public Library dedicated",
  "5-24": "1844: First telegraph message: 'What hath God wrought'",
  "5-25": "1961: JFK announces Moon landing goal",
  "5-26": "1896: Dow Jones Industrial Average created",
  "5-27": "1930: Masking tape patented by 3M",
  "5-28": "1959: First primates in space return safely",
  "5-29": "1953: Edmund Hillary summits Mount Everest",
  "5-30": "1971: Mariner 9 launches to Mars orbit",
  "5-31": "2005: Deep Throat identity revealed after 30 years",
  "6-1": "2009: General Motors files for bankruptcy",
  "6-2": "1966: Surveyor 1 soft lands on Moon, first US",
  "6-3": "1965: Ed White first American spacewalk",
  "6-4": "1989: Tiananmen Square protests peak",
  "6-5": "1977: Apple II computer goes on sale",
  "6-6": "1984: Tetris video game invented",
  "6-7": "1975: Sony introduces Betamax video recorder",
  "6-8": "2004: Transit of Venus visible, first since 1882",
  "6-9": "1934: Donald Duck makes first appearance",
  "6-10": "2003: Spirit rover launches to Mars",
  "6-11": "1898: Remote control invented by Nikola Tesla",
  "6-12": "1967: Venera 4 launched to Venus atmosphere",
  "6-13": "1983: Pioneer 10 passes Neptune orbit, first",
  "6-14": "1951: UNIVAC computer dedicated, first commercial",
  "6-15": "1977: Spain has first democratic elections in 41 years",
  "6-16": "1963: Valentina Tereshkova first woman in space",
  "6-17": "1994: O.J. Simpson car chase watched by 95 million",
  "6-18": "1983: Sally Ride first American woman in space",
  "6-19": "1978: Garfield comic strip debuts",
  "6-20": "1969: Moon landing preparations intensify",
  "6-21": "2004: SpaceShipOne first private space flight",
  "6-22": "1978: Charon, Pluto's moon, discovered",
  "6-23": "1988: Climate change testimony to US Congress",
  "6-24": "1997: First US Air Force report on Roswell incident",
  "6-25": "1967: First global TV broadcast via satellite",
  "6-26": "1974: First barcode scan on Wrigley's gum",
  "6-27": "1967: First ATM installed in London",
  "6-28": "1969: Stonewall uprising begins",
  "6-29": "2007: Apple iPhone goes on sale",
  "6-30": "1905: Einstein publishes Special Relativity paper",
  "7-1": "1979: Sony Walkman goes on sale in Japan",
  "7-2": "1900: First Zeppelin flight",
  "7-3": "1886: Karl Benz unveils first automobile",
  "7-4": "2012: Higgs Boson discovery announced at CERN",
  "7-5": "1996: Dolly the sheep born, first cloned mammal",
  "7-6": "1885: Louis Pasteur tests rabies vaccine",
  "7-7": "1928: Sliced bread first sold commercially",
  "7-8": "1994: Kim Il-sung dies after 46 years in power",
  "7-9": "1979: Voyager 2 closest approach to Jupiter",
  "7-10": "1962: Telstar satellite enables first transatlantic TV",
  "7-11": "1979: Skylab space station reenters atmosphere",
  "7-12": "2012: Scientists confirm high-speed rail possible",
  "7-13": "1977: NYC blackout triggers looting, arson",
  "7-14": "2015: New Horizons arrives at Pluto",
  "7-15": "1965: Mariner 4 sends first Mars close-ups",
  "7-16": "1969: Apollo 11 launches toward Moon",
  "7-17": "1975: Apollo-Soyuz crews shake hands in space",
  "7-18": "1968: Intel Corporation founded",
  "7-19": "1989: United Flight 232 crash lands, 185 survive",
  "7-20": "1969: Neil Armstrong walks on the Moon",
  "7-21": "1969: Armstrong and Aldrin leave Moon surface",
  "7-22": "2013: Royal baby born, Prince George",
  "7-23": "1995: Comet Hale-Bopp discovered",
  "7-24": "1969: Apollo 11 splashes down safely",
  "7-25": "1978: First test tube baby Louise Brown born",
  "7-26": "2005: Space Shuttle Discovery first post-Columbia",
  "7-27": "1921: Insulin first isolated for diabetes",
  "7-28": "1976: Tangshan earthquake kills 242,000",
  "7-29": "1958: NASA created by US Congress",
  "7-30": "1971: Apollo 15 lands on Moon with Lunar Rover",
  "7-31": "1999: First controlled crash landing on Moon",
  "8-1": "1981: MTV launches with Video Killed Radio Star",
  "8-2": "1939: Albert Einstein letter leads to Manhattan Project",
  "8-3": "2004: Messenger spacecraft launches to Mercury",
  "8-4": "2007: Phoenix Mars lander launches",
  "8-5": "2011: Juno spacecraft launches to Jupiter",
  "8-6": "1945: First atomic bomb dropped on Hiroshima",
  "8-7": "1959: Explorer 6 sends first photo of Earth from space",
  "8-8": "1989: Space Shuttle Columbia launches on secret mission",
  "8-9": "1945: Second atomic bomb dropped on Nagasaki",
  "8-10": "1966: Lunar Orbiter 1 enters Moon orbit",
  "8-11": "1999: Last total solar eclipse of millennium",
  "8-12": "1981: IBM PC introduced, revolutionizing computing",
  "8-13": "1889: William Gray patents coin-operated telephone",
  "8-14": "1959: First photograph of Earth from space",
  "8-15": "1977: Big Ear detects Wow! signal from space",
  "8-16": "1960: Joseph Kittinger parachutes from 102,800 feet",
  "8-17": "1958: Pioneer 0 launch attempt, first Moon probe try",
  "8-18": "1868: Element Helium discovered in solar spectrum",
  "8-19": "1960: Sputnik 5 launches dogs Belka and Strelka",
  "8-20": "1977: Voyager 2 launches toward outer planets",
  "8-21": "2017: Total solar eclipse crosses entire US",
  "8-22": "1989: Voyager 2 discovers Neptune's rings",
  "8-23": "1966: First photo of Earth from Moon orbit",
  "8-24": "2006: Pluto reclassified as dwarf planet",
  "8-25": "1989: Voyager 2 closest approach to Neptune",
  "8-26": "2012: Voyager 1 enters interstellar space",
  "8-27": "2003: Mars closest to Earth in 60,000 years",
  "8-28": "1993: Galileo spacecraft flyby of asteroid Ida",
  "8-29": "1949: Soviet Union tests first atomic bomb",
  "8-30": "1984: Space Shuttle Discovery maiden voyage",
  "8-31": "2012: Curiosity rover completes first Mars drive",
  "9-1": "1979: Pioneer 11 reaches Saturn, first probe",
  "9-2": "1969: First ATM in US installed in New York",
  "9-3": "1976: Viking 2 lands on Mars",
  "9-4": "1998: Google founded by Page and Brin",
  "9-5": "1977: Voyager 1 launches toward outer solar system",
  "9-6": "1995: Cal Ripken Jr. breaks consecutive games record",
  "9-7": "1927: First electronic television demonstrated",
  "9-8": "1966: Star Trek premieres on NBC",
  "9-9": "1947: First computer bug found (actual moth)",
  "9-10": "2008: Large Hadron Collider first activated",
  "9-11": "1985: Comet Halley last appeared from Earth",
  "9-12": "1959: Soviet Luna 2 first spacecraft to hit Moon",
  "9-13": "1959: Luna 2 impacts Moon surface",
  "9-14": "2015: LIGO detects gravitational waves",
  "9-15": "1997: Google.com domain registered",
  "9-16": "1987: Montreal Protocol signed on ozone",
  "9-17": "2009: Discovery of water on Moon confirmed",
  "9-18": "1977: Voyager 1 takes first photo of Earth and Moon",
  "9-19": "1988: Israel launches first satellite Ofeq 1",
  "9-20": "1519: Magellan begins circumnavigation voyage",
  "9-21": "2003: Galileo spacecraft plunges into Jupiter",
  "9-22": "1961: Peace Corps established by JFK",
  "9-23": "1846: Neptune discovered by Johann Galle",
  "9-24": "1970: Soviet Luna 16 first robotic Moon sample",
  "9-25": "1997: Thrust SSC breaks sound barrier on land",
  "9-26": "1983: Soviet officer prevents nuclear war",
  "9-27": "1905: E=mc² published by Einstein",
  "9-28": "2008: SpaceX Falcon 1 reaches orbit, first private",
  "9-29": "2011: China launches Tiangong-1 space station",
  "9-30": "1999: First Pokémon games released outside Japan",
  "10-1": "1971: Walt Disney World opens in Florida",
  "10-2": "2006: West Nickel Mines school shooting",
  "10-3": "1942: V-2 rocket successful test launch",
  "10-4": "1957: Sputnik 1 launched, first artificial satellite",
  "10-5": "2011: Steve Jobs dies at 56",
  "10-6": "1995: First exoplanet 51 Pegasi b confirmed",
  "10-7": "1959: Luna 3 photographs far side of Moon",
  "10-8": "2014: First blood moon of lunar tetrad",
  "10-9": "2009: NASA LCROSS impacts Moon seeking water",
  "10-10": "1846: Neptune's moon Triton discovered",
  "10-11": "1968: Apollo 7 first crewed Apollo mission",
  "10-12": "1999: World population reaches 6 billion",
  "10-13": "1773: Whirlpool Galaxy discovered",
  "10-14": "2012: Felix Baumgartner breaks sound barrier in freefall",
  "10-15": "1997: Cassini-Huygens launches to Saturn",
  "10-16": "2002: Dwarf planet Quaoar discovered",
  "10-17": "1989: Loma Prieta earthquake hits San Francisco",
  "10-18": "2007: One Laptop Per Child ships first devices",
  "10-19": "1872: Thomas Edison patents electric voting machine",
  "10-20": "2004: Ubuntu Linux 4.10 released",
  "10-21": "1879: Thomas Edison perfects practical light bulb",
  "10-22": "1938: First Xerox copy made",
  "10-23": "2001: Apple iPod unveiled by Steve Jobs",
  "10-24": "1946: First photo of Earth from space (V-2 rocket)",
  "10-25": "2001: Windows XP released by Microsoft",
  "10-26": "2007: Lockheed Martin SR-72 announced",
  "10-27": "1994: Netscape Navigator browser released",
  "10-28": "1886: Statue of Liberty dedicated",
  "10-29": "1969: First ARPANET message sent, Internet born",
  "10-30": "1938: War of Worlds radio broadcast causes panic",
  "10-31": "2005: NASA announces discovery of two Pluto moons",
  "11-1": "1952: First hydrogen bomb test at Enewetak",
  "11-2": "2000: First crew arrives at ISS, Expedition 1",
  "11-3": "1957: Laika first animal to orbit Earth (Sputnik 2)",
  "11-4": "2008: Barack Obama elected 44th US President",
  "11-5": "1895: George Selden patents gasoline automobile",
  "11-6": "2013: India launches Mars Orbiter Mission",
  "11-7": "1940: Tacoma Narrows Bridge collapses (engineering)",
  "11-8": "1895: Wilhelm Röntgen discovers X-rays",
  "11-9": "1989: Berlin Wall falls",
  "11-10": "1983: Microsoft Word first released",
  "11-11": "1930: Albert Einstein refrigerator patented",
  "11-12": "2014: Philae lands on comet 67P, first ever",
  "11-13": "1971: Mariner 9 first spacecraft to orbit Mars",
  "11-14": "1969: Apollo 12 launches to Moon",
  "11-15": "1988: Soviet Buran shuttle first and only flight",
  "11-16": "1974: Arecibo message sent to star cluster M13",
  "11-17": "1970: Soviet Lunokhod 1 first rover on Moon",
  "11-18": "1963: Push-button telephone service begins",
  "11-19": "1969: Apollo 12 astronauts land on Moon",
  "11-20": "1998: First ISS module Zarya launched",
  "11-21": "1877: Thomas Edison announces phonograph",
  "11-22": "2005: Xbox 360 launches worldwide",
  "11-23": "1992: First smartphone IBM Simon announced",
  "11-24": "1859: Darwin publishes Origin of Species",
  "11-25": "1915: Einstein presents general relativity theory",
  "11-26": "2011: Curiosity rover launches to Mars",
  "11-27": "1971: Mars 2 probe reaches Mars, first",
  "11-28": "1964: Mariner 4 launches to Mars flyby",
  "11-29": "1972: Atari releases Pong arcade game",
  "11-30": "1954: Meteorite hits woman in Alabama",
  "12-1": "1959: Antarctica Treaty signed, science preserved",
  "12-2": "1942: First nuclear chain reaction achieved",
  "12-3": "1992: First SMS text message sent",
  "12-4": "1996: Mars Pathfinder launched with Sojourner",
  "12-5": "2003: Sony Walkman discontinued announcement",
  "12-6": "1877: Thomas Edison records voice on phonograph",
  "12-7": "1972: Apollo 17 launches, last Moon mission",
  "12-8": "2010: SpaceX Dragon first commercial craft to ISS",
  "12-9": "1968: Douglas Engelbart demos mouse and hypertext",
  "12-10": "1901: First Nobel Prizes awarded",
  "12-11": "1998: Mars Climate Orbiter launched",
  "12-12": "2012: North Korea launches first satellite",
  "12-13": "1962: Relay 1 satellite enables transatlantic TV",
  "12-14": "1972: Last humans leave Moon (Apollo 17)",
  "12-15": "1995: First GPS satellite constellation complete",
  "12-16": "1965: Pioneer 6 launched, still functioning",
  "12-17": "1903: Wright Brothers first powered flight",
  "12-18": "1958: SCORE satellite broadcasts Ike's message",
  "12-19": "1972: Apollo 17 returns, end of Moon era",
  "12-20": "1996: Carl Sagan dies, renowned astronomer",
  "12-21": "1968: Apollo 8 launches to orbit Moon",
  "12-22": "2015: SpaceX Falcon 9 first stage lands vertically",
  "12-23": "1947: Transistor invented at Bell Labs",
  "12-24": "1968: Apollo 8 Earthrise photo taken",
  "12-25": "2021: James Webb Space Telescope launches",
  "12-26": "2004: Indian Ocean earthquake and tsunami",
  "12-27": "1831: HMS Beagle departs with Darwin aboard",
  "12-28": "1895: First commercial movie screening by Lumières",
  "12-29": "1989: Nikkei index reaches all-time high",
  "12-30": "1924: Edwin Hubble proves galaxies beyond Milky Way",
  "12-31": "1999: Y2K preparations finalized worldwide",
}

function getTodayEvent(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const key = `${month}-${day}`
  return techScienceEvents[key] || "Technology shapes our world every day"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const width = Number(searchParams.get("width")) || 1179
  const height = Number(searchParams.get("height")) || 2556

  // Calculate days passed in 2026
  const now = new Date()
  const startOf2026 = new Date(2026, 0, 1)
  const endOf2026 = new Date(2026, 11, 31)

  // Total days in 2026
  const totalDays = 365

  // Days passed (if we're in 2026)
  let daysPassed = 0
  if (now >= startOf2026 && now <= endOf2026) {
    daysPassed = Math.floor(
      (now.getTime() - startOf2026.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  } else if (now > endOf2026) {
    daysPassed = totalDays
  }

  // Get today's historical event
  const todayEvent = getTodayEvent()

  // Grid configuration - 15 dots per row, continuous single block
  const cols = 15
  const rows = Math.ceil(totalDays / cols)

  // Calculate dot sizing - smaller dots for more top space
  const horizontalPadding = width * 0.12 // Side padding
  const topPadding = height * 0.26 // More space for iOS time + event text
  const bottomPadding = height * 0.08 // Space for bottom stats
  const availableWidth = width - horizontalPadding * 2
  const availableHeight = height - topPadding - bottomPadding
  
  const dotSpacing = Math.min(availableWidth / cols, availableHeight / rows)
  const dotSize = dotSpacing * 0.52 // Smaller dots

  const gridWidth = cols * dotSpacing
  const gridHeight = rows * dotSpacing

  // Position grid with top padding for iOS clock
  const startX = (width - gridWidth) / 2 + dotSpacing / 2
  const startY = topPadding + (availableHeight - gridHeight) / 2

  const daysLeft = totalDays - daysPassed
  const percentage = Math.round((daysPassed / totalDays) * 100)
  const fontSize = Math.floor(width * 0.032) // Smaller text
  const eventFontSize = Math.floor(width * 0.022) // Smaller event text

  return new ImageResponse(
    (
      <div
        style={{
          width: width,
          height: height,
          backgroundColor: "#121214",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Historical event text at top - one line within grid width */}
        <div
          style={{
            position: "absolute",
            top: startY - dotSpacing * 1.2,
            left: startX - dotSpacing / 2,
            width: gridWidth,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span 
            style={{ 
              color: "#52525b", 
              fontSize: eventFontSize,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {todayEvent}
          </span>
        </div>

        {/* Generate all dots */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          const x = startX + col * dotSpacing
          const y = startY + row * dotSpacing

          const isToday = i === daysPassed - 1
          const isPassed = i < daysPassed - 1

          let bgColor = "#3a3a3c" // dark gray for future days
          if (isToday) {
            bgColor = "#14b8a6" // teal for today
          } else if (isPassed) {
            bgColor = "#ffffff" // white for passed days
          }

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - dotSize / 2,
                top: y - dotSize / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: bgColor,
              }}
            />
          )
        })}

        {/* Bottom stats */}
        <div
          style={{
            position: "absolute",
            bottom: height * 0.06,
            left: 0,
            width: width,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#14b8a6", fontSize: fontSize }}>{daysLeft}d left</span>
          <span style={{ color: "#6b7280", fontSize: fontSize, marginLeft: 12, marginRight: 12 }}>·</span>
          <span style={{ color: "#6b7280", fontSize: fontSize }}>{percentage}%</span>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  )
}
