/* Переводы: английский (en) и норвежский (no). Русский текст хранится в data.js. */

const CATS_T = {
  en: ['Meat and fish', 'Dairy and eggs', 'Fruit and vegetables', 'Grains, pasta, bread', 'Canned goods and legumes', 'Nuts, oils, other'],
  no: ['Kjøtt og fisk', 'Meieri og egg', 'Frukt og grønt', 'Korn, pasta og brød', 'Hermetikk og belgfrukter', 'Nøtter, oljer og annet']
};

// Английские названия продуктов (норвежские берутся из PRODUCTS[..].no)
const PROD_EN = {
  chickthigh: 'Boneless chicken thighs', chickfillet: 'Chicken breast fillet', chickmince: 'Minced chicken', beefmince: 'Minced beef',
  porkmince: 'Minced pork', salmon: 'Salmon fillet (frozen is fine)', cod: 'Cod fillet (frozen is fine)', tuna: 'Tuna in water',
  chickdeli: 'Sliced chicken deli meat', egg: 'Eggs', yog: 'Plain yoghurt (or skyr)', cottage: 'Cottage cheese', cheese: 'Cheese',
  milk: 'Semi-skimmed milk 1.5%', feta: 'Feta', butter: 'Butter', coconut: 'Light coconut milk', broccoli: 'Broccoli', carrot: 'Carrots',
  paprika: 'Bell pepper', zucchini: 'Zucchini', onion: 'Onion', tomato: 'Tomatoes', cucumber: 'Cucumber', spinach: 'Frozen spinach',
  greenbeans: 'Green beans', wok: 'Frozen stir-fry vegetables', mushroom: 'Mushrooms', avocado: 'Avocado', banana: 'Bananas', apple: 'Apples',
  pear: 'Pears', orange: 'Oranges', kiwi: 'Kiwi', blueberry: 'Frozen blueberries', raspberry: 'Frozen raspberries', oj: 'Orange juice',
  oats: 'Rolled oats', rice: 'White rice', pasta: 'Whole-grain pasta (any shape, spaghetti)', couscous: 'Couscous', bulgur: 'Bulgur',
  buckwheat: 'Buckwheat groats', potato: 'Potatoes', sweetpotato: 'Sweet potato', bread: 'Your whole-grain bread', crisp: 'Crispbread',
  pita: 'Pita bread', muesli: 'Unsweetened muesli', kidney: 'Kidney beans (canned, drained)', blackbeans: 'Black beans (canned, drained)',
  chickpeas: 'Chickpeas (canned, drained)', lentils: 'Red lentils (dry)', hummus: 'Hummus', choptom: 'Chopped tomatoes (can)',
  corn: 'Sweetcorn (canned)', walnuts: 'Walnuts', almonds: 'Almonds', cashews: 'Cashews', pb: 'Peanut butter', choc: 'Dark chocolate',
  oil: 'Olive oil', honey: 'Honey', cocoa: 'Cocoa powder', soy: 'Soy sauce', spices: 'Salt, pepper, spices, garlic'
};

const DISH_T = {
  B1: { en: { name: 'Oats cooked in milk with yoghurt, banana and peanut butter', steps: ['Pour milk over the oats and microwave 2–3 minutes.', 'Add yoghurt, sliced banana and peanut butter.'] },
        no: { name: 'Havregrøt kokt i melk med yoghurt, banan og peanøttsmør', steps: ['Hell melk over havregrynene og mikro i 2–3 minutter.', 'Tilsett yoghurt, oppskåret banan og peanøttsmør.'] } },
  B2: { en: { name: 'Egg and cheese sandwiches, glass of milk', steps: ['2 boiled eggs (boiled on Sunday).', 'Butter the bread, add cheese, egg, tomato and cucumber. Drink the milk.'] },
        no: { name: 'Brødskiver med egg og ost, glass melk', steps: ['2 kokte egg (kokt på søndag).', 'Smør brødet, legg på ost, egg, tomat og agurk. Drikk melken ved siden av.'] } },
  B3: { en: { name: 'Muesli with yoghurt, blueberries, banana and almonds', steps: ['Pour yoghurt over the muesli, top with blueberries (frozen is fine), banana and almonds.'] },
        no: { name: 'Müsli med yoghurt, blåbær, banan og mandler', steps: ['Hell yoghurt over müslien, topp med blåbær (frosne går fint), banan og mandler.'] } },
  B4: { en: { name: 'Scrambled eggs on toast with avocado, orange juice', steps: ['Whisk 3 eggs and scramble in a pan for 3–4 minutes, stirring.', 'Toast the bread. Serve with tomato and avocado, with juice on the side.'] },
        no: { name: 'Eggerøre på toast med avokado, appelsinjuice', steps: ['Visp 3 egg og rør dem i stekepanne i 3–4 minutter.', 'Rist brødet. Server med tomat og avokado, og drikk juice til.'] } },
  B5: { en: { name: 'Bread with cottage cheese and vegetables, banana and orange', steps: ['Bread topped with cottage cheese, cucumber and pepper. Banana and orange for dessert.'] },
        no: { name: 'Brød med cottage cheese og grønnsaker, banan og appelsin', steps: ['Brød med cottage cheese, agurk og paprika. Banan og appelsin til dessert.'] } },
  B6: { en: { name: 'Peanut butter and banana toast, yoghurt, milk', steps: ['Toast the bread, spread peanut butter and add banana. Yoghurt and milk on the side.'] },
        no: { name: 'Toast med peanøttsmør og banan, yoghurt, melk', steps: ['Rist brødet, smør på peanøttsmør og legg på banan. Yoghurt og melk ved siden av.'] } },
  B7: { en: { name: 'Cocoa oats with raspberries and yoghurt', steps: ['Mix oats with cocoa, add milk, microwave 2–3 minutes.', 'Add yoghurt, raspberries and honey.'] },
        no: { name: 'Kakaohavregrøt med bringebær og yoghurt', steps: ['Bland havregryn og kakao, hell på melk, mikro i 2–3 minutter.', 'Tilsett yoghurt, bringebær og honning.'] } },
  B8: { en: { name: 'Muesli with milk and apple, sandwich, yoghurt', steps: ['Pour milk over the muesli, add chopped apple. Bread and yoghurt on the side.'] },
        no: { name: 'Müsli med melk og eple, brødskive, yoghurt', steps: ['Hell melk over müslien og tilsett oppskåret eple. Brød og yoghurt ved siden av.'] } },

  S1: { en: { name: 'Apple, walnuts, bread', steps: ['Ready to eat.'] }, no: { name: 'Eple, valnøtter, brød', steps: ['Klart til servering.'] } },
  S2: { en: { name: 'Yoghurt with honey, almonds and banana', steps: ['Slice the banana into the yoghurt, add honey and almonds.'] },
        no: { name: 'Yoghurt med honning, mandler og banan', steps: ['Skjær bananen i yoghurten, tilsett honning og mandler.'] } },
  S3: { en: { name: 'Crispbread with cottage cheese and cucumber, pear, cashews', steps: ['Cottage cheese and cucumber on crispbread, pear and cashews on the side.'] },
        no: { name: 'Knekkebrød med cottage cheese og agurk, pære, cashewnøtter', steps: ['Cottage cheese og agurk på knekkebrød, pære og cashewnøtter ved siden av.'] } },
  S4: { en: { name: 'Chicken and cheese sandwich, carrot, orange', steps: ['Sandwich with sliced chicken and cheese, carrot sticks and an orange.'] },
        no: { name: 'Brødskive med kylling og ost, gulrot, appelsin', steps: ['Brødskive med kyllingpålegg og ost, gulrotstaver og en appelsin.'] } },
  S5: { en: { name: 'Banana, almonds, dark chocolate, milk', steps: ['Ready to eat.'] }, no: { name: 'Banan, mandler, mørk sjokolade, melk', steps: ['Klart til servering.'] } },
  S6: { en: { name: '2 boiled eggs, bread, tomato, apple', steps: ['Eggs boiled on Sunday.'] }, no: { name: '2 kokte egg, brød, tomat, eple', steps: ['Eggene er kokt på søndag.'] } },
  S7: { en: { name: 'Hummus with pita and vegetables', steps: ['Cut vegetables into sticks, dip in hummus and eat with the pita.'] },
        no: { name: 'Hummus med pitabrød og grønnsaker', steps: ['Skjær grønnsakene i staver, dypp i hummus og spis med pitabrødet.'] } },
  S8: { en: { name: 'Cottage cheese with kiwi and walnuts, crispbread', steps: ['Cottage cheese with sliced kiwi and nuts, crispbread on the side.'] },
        no: { name: 'Cottage cheese med kiwi og valnøtter, knekkebrød', steps: ['Cottage cheese med oppskåret kiwi og nøtter, knekkebrød ved siden av.'] } },

  L1: { en: { name: 'Oven-baked chicken with rice, broccoli and carrots', steps: ['Season the chicken with salt and pepper, brush with half the oil, bake at 200 °C for 25–30 minutes.', 'Chop broccoli and carrots, drizzle with oil, roast 20–25 minutes.', 'Cook the rice for 15 minutes.'] },
        no: { name: 'Ovnsbakt kylling med ris, brokkoli og gulrot', steps: ['Krydre kyllingen med salt og pepper, pensle med halve oljen, stek på 200 °C i 25–30 minutter.', 'Skjær brokkoli og gulrot, ringle over olje, stek i 20–25 minutter.', 'Kok risen i 15 minutter.'] } },
  D1: { en: { name: 'Pasta bolognese with mushrooms', steps: ['Fry onion, carrot and mushrooms in oil for 8 minutes.', 'Add the mince, fry 10 minutes, pour in tomatoes and spices, simmer 30 minutes.', 'Cook the pasta 10–12 minutes and mix with the sauce.'] },
        no: { name: 'Pasta bolognese med sopp', steps: ['Stek løk, gulrot og sopp i olje i 8 minutter.', 'Tilsett kjøttdeigen, stek i 10 minutter, hell i tomater og krydder, la småkoke i 30 minutter.', 'Kok pastaen i 10–12 minutter og bland med sausen.'] } },
  L2: { en: { name: 'Baked salmon with potatoes and broccoli', steps: ['Cut potatoes into wedges, toss in oil, bake at 200 °C for 35 minutes.', 'Season the salmon and add it to the tray for the last 15 minutes. Broccoli on a second tray for 20 minutes.'] },
        no: { name: 'Ovnsbakt laks med poteter og brokkoli', steps: ['Skjær potetene i båter, vend i olje, stek på 200 °C i 35 minutter.', 'Salt laksen og legg den på stekebrettet de siste 15 minuttene. Brokkoli på et eget brett i 20 minutter.'] } },
  D2: { en: { name: 'Chicken chili with beans and rice', steps: ['Fry onion, pepper and mushrooms for 8 minutes.', 'Add mince and brown it, pour in tomatoes and beans, add spices, simmer 30 minutes.', 'Cook the rice for 15 minutes.'] },
        no: { name: 'Kyllingchili med bønner og ris', steps: ['Stek løk, paprika og sopp i 8 minutter.', 'Tilsett kjøttdeig og brun den, hell i tomater og bønner, krydre og la småkoke i 30 minutter.', 'Kok risen i 15 minutter.'] } },
  L3: { en: { name: 'Chicken thighs with couscous, zucchini and pepper', steps: ['Season thighs, pan-fry or bake at 200 °C for 25 minutes.', 'Chop zucchini and pepper, roast 20 minutes.', 'Pour boiling water over the couscous (1:1), cover for 5 minutes.'] },
        no: { name: 'Kyllinglår med couscous, squash og paprika', steps: ['Krydre lårene, stek i panne eller i ovnen på 200 °C i 25 minutter.', 'Skjær squash og paprika, stek i 20 minutter.', 'Hell kokende vann over couscousen (1:1), dekk til i 5 minutter.'] } },
  D3: { en: { name: 'Red lentil curry with sweet potato, spinach and egg', steps: ['Fry onion with curry powder, add cubed sweet potato, lentils, tomatoes and coconut milk.', 'Simmer 25 minutes, add spinach at the end.', 'Hard-boil 7 eggs, one per portion.'] },
        no: { name: 'Rød linsecurry med søtpotet, spinat og egg', steps: ['Stek løk med karri, tilsett søtpotetterninger, linser, tomater og kokosmelk.', 'La småkoke i 25 minutter, tilsett spinat helt til slutt.', 'Hardkok 7 egg, ett per porsjon.'] } },
  L4: { en: { name: 'Tuna pasta in tomato sauce with spinach', steps: ['Fry onion, add tomatoes, cook 10 minutes. Add thawed spinach and tuna.', 'Cook pasta 10–12 minutes and mix with the sauce.'] },
        no: { name: 'Pasta med tunfisk i tomatsaus og spinat', steps: ['Stek løk, tilsett tomater og kok i 10 minutter. Tilsett tint spinat og tunfisk.', 'Kok pastaen i 10–12 minutter og bland med sausen.'] } },
  D4: { en: { name: 'Pork meatballs with potatoes and green beans', steps: ['Mix mince with onion, egg, salt and pepper. Shape meatballs and bake at 200 °C for 20–25 minutes.', 'Boil or roast the potatoes, boil the green beans for 5 minutes.'] },
        no: { name: 'Svinekjøttboller med poteter og grønne bønner', steps: ['Bland kjøttdeig med løk, egg, salt og pepper. Form kjøttboller og stek på 200 °C i 20–25 minutter.', 'Kok eller stek potetene, kok de grønne bønnene i 5 minutter.'] } },
  L5: { en: { name: 'Chicken stir-fry with spaghetti and vegetables', steps: ['Cut the chicken into strips, fry in oil for 6–8 minutes.', 'Add vegetables and sauce for 6 minutes. Cook spaghetti 10 minutes and mix.'] },
        no: { name: 'Kyllingwok med spaghetti og grønnsaker', steps: ['Skjær kyllingen i strimler, stek i olje i 6–8 minutter.', 'Tilsett grønnsaker og saus i 6 minutter. Kok spaghetti i 10 minutter og bland.'] } },
  D5: { en: { name: 'Beef taco skillet with black beans and bulgur', steps: ['Fry the mince for 10 minutes with mushrooms and pepper.', 'Add tomatoes, beans, corn and taco spices, simmer 20 minutes.', 'Cook the bulgur 12 minutes (1:2).'] },
        no: { name: 'Tacogryte med storfe, svarte bønner og bulgur', steps: ['Stek kjøttdeigen i 10 minutter med sopp og paprika.', 'Tilsett tomater, bønner, mais og tacokrydder, la småkoke i 20 minutter.', 'Kok bulguren i 12 minutter (1:2).'] } },
  L6: { en: { name: 'Cod with potatoes, broccoli and carrots', steps: ['Roast potatoes and carrots at 200 °C for 30 minutes.', 'Season the cod and add for 12–15 minutes, broccoli for 12 minutes.'] },
        no: { name: 'Torsk med poteter, brokkoli og gulrot', steps: ['Stek poteter og gulrot på 200 °C i 30 minutter.', 'Salt torsken og legg den på i 12–15 minutter, brokkoli i 12 minutter.'] } },
  D6: { en: { name: 'Chicken thighs with sweet potato, green beans and feta', steps: ['Roast cubed sweet potato and thighs at 200 °C for 30 minutes.', 'Boil green beans for 5 minutes. Crumble feta over each portion.'] },
        no: { name: 'Kyllinglår med søtpotet, grønne bønner og fetaost', steps: ['Stek søtpotetterninger og lår på 200 °C i 30 minutter.', 'Kok grønne bønner i 5 minutter. Smuldre fetaost over hver porsjon.'] } },
  L7: { en: { name: 'Frittata with potatoes, spinach and cheese, bread', steps: ['Boil potatoes 15 minutes and slice. Whisk 21 eggs with salt, stir in spinach and cheese.', 'Pour over the potatoes in a dish, bake at 180 °C for 30 minutes. Cut into 7 portions.'] },
        no: { name: 'Frittata med poteter, spinat og ost, brød', steps: ['Kok poteter i 15 minutter og skjær i skiver. Visp 21 egg med salt, rør inn spinat og ost.', 'Hell over potetene i en form, stek på 180 °C i 30 minutter. Del i 7 porsjoner.'] } },
  D7: { en: { name: 'Chicken pasta bake with cheese', steps: ['Fry onion, zucchini and mushrooms, add mince and tomatoes, cook 15 minutes.', 'Cook the pasta 2 minutes short. Mix with the sauce, top with cheese, bake at 200 °C for 15 minutes.'] },
        no: { name: 'Pastagrateng med kyllingdeig og ost', steps: ['Stek løk, squash og sopp, tilsett kjøttdeig og tomater, kok i 15 minutter.', 'Kok pastaen 2 minutter kortere. Bland med sausen, ha ost på toppen og stek på 200 °C i 15 minutter.'] } },
  L8: { en: { name: 'Salmon with rice, broccoli and carrots', steps: ['Season the salmon and bake at 200 °C for 12–15 minutes with the broccoli and carrots.', 'Cook the rice for 15 minutes.'] },
        no: { name: 'Laks med ris, brokkoli og gulrot', steps: ['Salt laksen og stek på 200 °C i 12–15 minutter sammen med brokkoli og gulrot.', 'Kok risen i 15 minutter.'] } },
  D8: { en: { name: 'Chicken curry with chickpeas and buckwheat', steps: ['Fry onion with curry powder, add cubed chicken, 8 minutes.', 'Pour in tomatoes and coconut milk, add chickpeas, simmer 15 minutes.', 'Cook the buckwheat 15 minutes (1:2).'] },
        no: { name: 'Kyllingcurry med kikerter og bokhvete', steps: ['Stek løk med karri, tilsett kyllingterninger, 8 minutter.', 'Hell i tomater og kokosmelk, tilsett kikerter, la småkoke i 15 minutter.', 'Kok bokhveten i 15 minutter (1:2).'] } }
};

// Тексты шагов воскресного плана (времена берутся из WEEKS[].plan)
const PLAN_T = {
  1: { en: ['Heat the oven to 200 °C. Chop broccoli and carrots, prepare the chicken.', 'Chicken and vegetables on two trays in the oven (25–30 minutes). Start the rice.', 'Bolognese: fry onion, carrot, mushrooms, then the mince, add tomatoes, simmer 30 minutes.', 'Cook the pasta and mix with the sauce. Take out the chicken and vegetables.', 'Cool for 20–30 minutes, divide into 14 containers.', 'Fridge and freezer as shown below. Done.'],
       no: ['Varm ovnen til 200 °C. Skjær brokkoli og gulrot, gjør kyllingen klar.', 'Kylling og grønnsaker på to brett i ovnen (25–30 minutter). Sett på risen.', 'Bolognese: stek løk, gulrot, sopp, så kjøttdeigen, tilsett tomater, la småkoke i 30 minutter.', 'Kok pastaen og bland med sausen. Ta ut kylling og grønnsaker.', 'La avkjøle i 20–30 minutter, fordel på 14 beholdere.', 'Kjøleskap og fryser som vist under. Ferdig.'] },
  2: { en: ['Oven to 200 °C. Boil 14 eggs (10 minutes) for breakfasts. Chop potatoes and broccoli.', 'Potatoes in the oven (35 minutes). Start the rice.', 'Chili: fry onion, pepper, mushrooms, mince, tomatoes and beans, simmer 30 minutes.', 'Salmon and broccoli in the oven for 15 minutes.', 'Take everything out, cool, divide into 14 portions.', 'Salmon: 3 portions in the fridge, 4 in the freezer. Chili: 4 in the fridge, 3 in the freezer.'],
       no: ['Ovn på 200 °C. Kok 14 egg (10 minutter) til frokost. Skjær poteter og brokkoli.', 'Poteter i ovnen (35 minutter). Sett på risen.', 'Chili: stek løk, paprika, sopp, kjøttdeig, tomater og bønner, la småkoke i 30 minutter.', 'Laks og brokkoli i ovnen i 15 minutter.', 'Ta alt ut, la avkjøle, fordel på 14 porsjoner.', 'Laks: 3 porsjoner i kjøleskapet, 4 i fryseren. Chili: 4 i kjøleskapet, 3 i fryseren.'] },
  3: { en: ['Oven to 200 °C. Hard-boil 7 eggs. Chop zucchini, pepper and sweet potato.', 'Thighs and vegetables in the oven for 25–30 minutes.', 'Curry: onion, sweet potato, lentils, tomatoes, coconut milk, simmer 25 minutes, spinach at the end.', 'Pour boiling water over the couscous, cover for 5 minutes.', 'Cool, divide into 14 portions, add an egg to each curry portion.', 'Fridge and freezer as shown below.'],
       no: ['Ovn på 200 °C. Hardkok 7 egg. Skjær squash, paprika og søtpotet.', 'Lår og grønnsaker i ovnen i 25–30 minutter.', 'Curry: løk, søtpotet, linser, tomater, kokosmelk, la småkoke i 25 minutter, spinat til slutt.', 'Hell kokende vann over couscousen, dekk til i 5 minutter.', 'La avkjøle, fordel på 14 porsjoner, legg ett egg i hver curryporsjon.', 'Kjøleskap og fryser som vist under.'] },
  4: { en: ['Oven to 200 °C. Chop the onion; shape meatballs from mince, egg and onion.', 'Meatballs in the oven for 20–25 minutes. Boil potatoes for 20 minutes.', 'Pasta sauce: onion, tomatoes, 10 minutes, then spinach and tuna.', 'Cook the pasta and mix with the sauce. Boil the green beans for 5 minutes.', 'Cool, divide into 14 portions.', 'Tuna pasta: 3 portions in the fridge, 4 in the freezer. Meatballs: 4 and 3.'],
       no: ['Ovn på 200 °C. Hakk løk; form kjøttboller av kjøttdeig, egg og løk.', 'Kjøttboller i ovnen i 20–25 minutter. Kok poteter i 20 minutter.', 'Pastasaus: løk, tomater, 10 minutter, så spinat og tunfisk.', 'Kok pastaen og bland med sausen. Kok grønne bønner i 5 minutter.', 'La avkjøle, fordel på 14 porsjoner.', 'Tunfiskpasta: 3 porsjoner i kjøleskapet, 4 i fryseren. Kjøttboller: 4 og 3.'] },
  5: { en: ['Cut the chicken into strips, take the stir-fry vegetables out of the freezer.', 'Taco skillet: fry mushrooms and pepper, then mince, add tomatoes and beans, simmer 20 minutes.', 'At the same time: chicken in a second pan for 8 minutes, then vegetables and sauce.', 'Cook spaghetti and bulgur (separate pots), mix with the stir-fry and the taco sauce.', 'Cool, divide into 14 portions.', 'Fridge and freezer as shown below.'],
       no: ['Skjær kyllingen i strimler, ta wokgrønnsakene ut av fryseren.', 'Tacogryte: stek sopp og paprika, så kjøttdeig, tilsett tomater og bønner, la småkoke i 20 minutter.', 'Samtidig: kylling i en annen panne i 8 minutter, så grønnsaker og saus.', 'Kok spaghetti og bulgur (i hver sin kasserolle), bland med woken og tacosausen.', 'La avkjøle, fordel på 14 porsjoner.', 'Kjøleskap og fryser som vist under.'] },
  6: { en: ['Oven to 200 °C. Boil 14 eggs for the snacks. Chop potatoes, sweet potato and carrots.', 'Potatoes, carrots, sweet potato and thighs in the oven (30 minutes). Prepare the green beans.', 'Cod and broccoli on a tray for 12–15 minutes. Boil the green beans for 5 minutes.', 'Crumble the feta into portions. Cool, divide into 14 portions.', 'Cod: 3 portions in the fridge, 4 in the freezer. Chicken: 4 and 3.'],
       no: ['Ovn på 200 °C. Kok 14 egg til mellommåltidene. Skjær poteter, søtpotet og gulrot.', 'Poteter, gulrot, søtpotet og lår i ovnen (30 minutter). Gjør de grønne bønnene klare.', 'Torsk og brokkoli på et brett i 12–15 minutter. Kok grønne bønner i 5 minutter.', 'Smuldre fetaost i porsjonene. La avkjøle, fordel på 14 porsjoner.', 'Torsk: 3 porsjoner i kjøleskapet, 4 i fryseren. Kylling: 4 og 3.'] },
  7: { en: ['Oven to 180 °C. Boil potatoes 15 minutes. Whisk 21 eggs, mix with spinach and cheese.', 'Frittata in the oven for 30 minutes.', 'Pasta bake: fry onion, zucchini, mushrooms, mince, tomatoes, 15 minutes. Cook pasta, mix, cheese on top.', 'Pasta bake in the oven for 15 minutes once the frittata is out.', 'Cool, cut and divide into 14 portions.', 'Fridge and freezer as shown below.'],
       no: ['Ovn på 180 °C. Kok poteter i 15 minutter. Visp 21 egg, bland med spinat og ost.', 'Frittata i ovnen i 30 minutter.', 'Pastagrateng: stek løk, squash, sopp, kjøttdeig, tomater, 15 minutter. Kok pasta, bland, ost på toppen.', 'Pastagratengen i ovnen i 15 minutter når frittataen er tatt ut.', 'La avkjøle, skjær og fordel på 14 porsjoner.', 'Kjøleskap og fryser som vist under.'] },
  8: { en: ['Oven to 200 °C. Chop vegetables. Start the rice and buckwheat.', 'Salmon, broccoli and carrots in the oven for 12–15 minutes.', 'Curry: onion, cubed chicken, tomatoes, coconut milk, chickpeas, 20 minutes.', 'Cool everything 20–30 minutes, divide into 14 portions.', 'Salmon: 3 portions in the fridge, 4 in the freezer. Curry: 4 and 3.'],
       no: ['Ovn på 200 °C. Skjær grønnsaker. Sett på ris og bokhvete.', 'Laks, brokkoli og gulrot i ovnen i 12–15 minutter.', 'Curry: løk, kyllingterninger, tomater, kokosmelk, kikerter, 20 minutter.', 'La alt avkjøle i 20–30 minutter, fordel på 14 porsjoner.', 'Laks: 3 porsjoner i kjøleskapet, 4 i fryseren. Curry: 4 og 3.'] }
};
