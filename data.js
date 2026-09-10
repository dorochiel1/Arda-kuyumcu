/* Riftborn IO v3 — shared rules for the browser, saves and room server. */
(function(root){'use strict';
const TIERS = [
 {name:'Demir',rarity:'Sıradan',color:'#c7d8e9',damage:9,durability:70,power:1,push:120,weight:97.5,effect:'Metal darbe',desc:'Temasta geri iter. En kolay yenilenen savunma.'},
 {name:'Yeşim',rarity:'Gelişmiş',color:'#55ed98',damage:12,durability:100,power:1.22,push:160,weight:2.35,effect:'Sarsıcı darbe',desc:'Daha güçlü itiş, kısa sersemletme.'},
 {name:'Buz',rarity:'Nadir',color:'#54deff',damage:16,durability:135,power:1.45,push:200,weight:.14,effect:'Donduran kesik',desc:'Hedefi yavaşlatır; buz parçaları ve don izi bırakır.'},
 {name:'Boşluk',rarity:'Destansı',color:'#b984ff',damage:22,durability:180,power:1.72,push:235,weight:.009,effect:'Yarık kesişi',desc:'Her üçüncü isabette daha güçlü mor yarık darbesi.'},
 {name:'Alev',rarity:'Efsanevi',color:'#ffac43',damage:29,durability:235,power:2.03,push:280,weight:.001,effect:'Köz patlaması',desc:'Küçük alana hasar verir ve hedefi kısa süre yakar.'}
];
const FORMS = [
 {name:'Hançer',reach:23,damage:.8,interval:.25,wear:.8,push:.8,clash:.84,desc:'Hızlı vuruş · kısa erişim · az aşınma'},
 {name:'Uzun kılıç',reach:37,damage:1,interval:.39,wear:1,push:1,clash:1,desc:'Uzun erişim · dengeli hasar'},
 {name:'Ağır kılıç',reach:29,damage:1.24,interval:.57,wear:1.17,push:1.4,clash:1.35,desc:'Güçlü itiş · yüksek silah aşındırma · yavaş vuruş'}
];
const CLASSES = [
 {id:'rogue',name:'Lyra',title:'Gölge avcısı',color:'#bd86f0',hp:120,speed:238,radius:101,spin:2.4,skill:'GÖLGE',skillIcon:'✦',desc:'Hızlı sıçrama. Sıçramadan sonraki ilk kesik güçlenir.',passive:'Pusu: sıçrama sonrası ilk isabette %25 ek hasar.',paths:[{id:'assassin',name:'Suikastçı',desc:'Hançer hasarı +%18; pusu daha güçlü.'},{id:'wind',name:'Rüzgâr',desc:'Hız +%10; sıçrama beklemesi −%20.'}]},
 {id:'knight',name:'Aren',title:'Demir muhafız',color:'#edc56c',hp:154,speed:209,radius:104,spin:2.1,skill:'KALKAN',skillIcon:'⬡',desc:'Dayanıklı kılıçlar. Kalkanı hasarı azaltır ve düşmanları iter.',passive:'Usta dövme: kılıçlar %10 daha az aşınır.',paths:[{id:'bastion',name:'Siper',desc:'Azami can +25; kalkan süresi uzar.'},{id:'breaker',name:'Kılıçkıran',desc:'Rakip kılıca aşınma +%22; itiş +%15.'}]},
 {id:'frost',name:'Neris',title:'Buz büyücüsü',color:'#78dfff',hp:118,speed:224,radius:111,spin:2.2,skill:'BUZ',skillIcon:'❄',desc:'Geniş menzil. Don çemberi saldırganları yavaşlatır.',passive:'Soğuk hâkimiyet: yavaşlamış hedefe %12 ek hasar.',paths:[{id:'winter',name:'Kış',desc:'Don süresi +%40; yetenek daha geniş alana yayılır.'},{id:'shatter',name:'Kırılma',desc:'Donmuş hedefe her üçüncü kesikte buz patlaması.'}]},
 {id:'warden',name:'Orin',title:'Orman bekçisi',color:'#87e4a2',hp:140,speed:224,radius:105,spin:2.25,skill:'KÖK',skillIcon:'✺',desc:'Kök tuzağı ve iyileşme. Çatışmadan uzaklaşınca daha hızlı toparlanır.',passive:'Yenilenme: 5 saniye hasar almayınca can yeniler.',paths:[{id:'grove',name:'Koruluk',desc:'Yetenek iyileşmesi +%40; toplama menzili artar.'},{id:'thorn',name:'Diken',desc:'İtiş +%20; kök patlaması daha sert vurur.'}]}
];
const UPGRADES = [
 {id:'damage',icon:'⚔',name:'Keskin irade',desc:'%8 hasar. Kılıç ağzında parlayan keskinlik izi.'},
 {id:'speed',icon:'ϟ',name:'Rüzgâr adımı',desc:'%6 hız. Ardıl izler ve daha sık sıçrama.'},
 {id:'radius',icon:'◎',name:'Geniş çember',desc:'Menzil +6. Çevrende ikinci bir rün halkası.'},
 {id:'heal',icon:'✚',name:'İkinci nefes',desc:'40 can yenile; azami can +8. Yeşil iyileşme dalgası.'},
 {id:'spin',icon:'↻',name:'Kasırga',desc:'%8 dönüş hızı. Uzayan kılıç izleri.'},
 {id:'magnet',icon:'⌁',name:'Çekim alanı',desc:'%20 toplama menzili. Ganimeti bağlayan çekim çizgileri.'},
 {id:'temper',icon:'◆',name:'Sağlam dövme',desc:'Aktif kılıçları %18 onar. Aşınma %8 azalır.'},
 {id:'nova',icon:'✺',name:'Öz güç',desc:'Sınıf yeteneği %15 güçlenir. Daha büyük ve belirgin etki.'}
];
const MOBS = {
 skeleton:{name:'Kemik gözcü',role:'avcı',fov:220,proximity:95,hp:52,speed:81,r:20,mass:.85,biome:0,skill:'Kemik hamlesi',color:'#e4d7b0',range:112,aggro:370,leash:520,windup:.6,cooldown:2.4,damage:12,shape:'cone',arc:.6},
 ogre:{name:'Yosun devi',role:'tank',fov:150,proximity:120,hp:180,speed:55,r:34,mass:2.7,biome:0,skill:'Kütük darbesi',color:'#b6df69',range:154,aggro:360,leash:470,windup:.95,cooldown:3.5,damage:22,shape:'circle'},
 imp:{name:'Köz cini',role:'menzilli',fov:205,proximity:85,hp:65,speed:96,r:20,mass:.8,biome:1,skill:'Kor oku',color:'#ff904a',range:315,aggro:470,leash:550,windup:.8,cooldown:2.9,damage:13,shape:'line'},
 beetle:{name:'Kızıl zırhlı',role:'hızlı',fov:170,proximity:105,hp:110,speed:67,r:24,mass:1.6,biome:1,skill:'Zırhlı hücum',color:'#f66b55',range:285,aggro:390,leash:550,windup:.9,cooldown:4,damage:18,shape:'charge'},
 golem:{name:'Kristal bekçi',role:'tank',fov:145,proximity:125,hp:155,speed:54,r:29,mass:2.3,biome:2,skill:'Kristal yarığı',color:'#9cbdff',range:240,aggro:390,leash:490,windup:1.1,cooldown:3.8,damage:19,shape:'crystal'},
 wraith:{name:'Ayaz ruhu',role:'pusu',fov:260,proximity:75,hp:76,speed:68,r:21,mass:.75,biome:2,skill:'Ayaz üçlüsü',color:'#7cddff',range:345,aggro:450,leash:570,windup:.95,cooldown:3.1,damage:11,shape:'fan'},
 necromancer:{name:'Kum büyücüsü',role:'destek',fov:215,proximity:90,hp:95,speed:60,r:24,mass:1,biome:3,skill:'Lanet çemberi',color:'#c798ff',range:350,aggro:440,leash:540,windup:1.05,cooldown:3.8,damage:16,shape:'curse'},
 elite:{name:'Harabe celladı',role:'elite',fov:235,proximity:115,hp:145,speed:76,r:26,mass:1.5,biome:3,skill:'Kemik yelpazesi',color:'#efbf77',range:225,aggro:410,leash:540,windup:.75,cooldown:3.1,damage:14,shape:'bonefan'}
};
const BIOMES=[{name:'YOSUN ORMANI',risk:1,color:'#1b5543',trap:'Diken kökleri',trapColor:'#d4e57b'}, {name:'KÖZ VADİSİ',risk:3,color:'#54352c',trap:'Lav çatlağı',trapColor:'#ff844e'}, {name:'BUZ SINIRI',risk:2,color:'#23536c',trap:'Ayaz yarığı',trapColor:'#73deff'}, {name:'KUM HARABELERİ',risk:4,color:'#655032',trap:'Antik dikenler',trapColor:'#f4c17c'}, {name:'YARIK TAPINAĞI',risk:5,color:'#234f59',trap:'Yarık darbesi',trapColor:'#bb8bff'}];
const BOT_PROFILES=[{id:0,name:'Avcı'}, {id:1,name:'Toplayıcı'}, {id:2,name:'Fırsatçı'}, {id:3,name:'Boss avcısı'}, {id:4,name:'Temkinli'}, {id:5,name:'Güçlüden kaçan'}];
const GOLD_REWARDS={skeleton:1,imp:1,beetle:2,wraith:2,necromancer:3,ogre:3,golem:4,elite:10,bone:65,dragon:85,boss:75};
const COSMETICS=[{id:'default',name:'Rift Çeliği',category:'Temel',price:0,color:'#d9edf7',accent:'#7cc8e8',desc:'Varsayılan Riftborn bıçağı.',unlock:'free'},{id:'crystal',name:'Kristal Muhafız',category:'Afilli',price:260,color:'#8cecff',accent:'#d8fbff',desc:'Keskin kristal yüzey ve hafif parıltı.',unlock:'gold'},{id:'black_knight',name:'Siyah Şövalye',category:'Ciddi',price:420,color:'#353947',accent:'#d6b86f',desc:'Koyu çelik, altın ağız çizgisi.',unlock:'gold'},{id:'neon',name:'Neon Yarık',category:'Afilli',price:680,color:'#4df7ff',accent:'#ce65ff',desc:'Enerji görünümü; istatistik değiştirmez.',unlock:'gold'},{id:'bone',name:'Kemik Kılıcı',category:'Tematik',price:0,color:'#e6d7ae',accent:'#8f7050',desc:'İlk boss zaferiyle açılır.',unlock:'boss_1'},{id:'toy',name:'Oyuncak Kılıç',category:'Komik',price:160,color:'#ff7eb6',accent:'#77d6ff',desc:'Renkli plastik görünüm.',unlock:'gold'},{id:'spoon',name:'Dev Kaşık',category:'Absürt',price:300,color:'#d9e5e9',accent:'#9aaeb7',desc:'Kaşık gibi görünür, hitbox aynı kalır.',unlock:'gold'},{id:'fish',name:'Balık',category:'Absürt',price:360,color:'#55c8ce',accent:'#f5d477',desc:'Balık görünümü. Güç avantajı vermez.',unlock:'gold'},{id:'stick',name:'Sopa',category:'Komik',price:90,color:'#8e5c35',accent:'#d5a66d',desc:'Sade tahta sopa.',unlock:'gold'},{id:'pixel',name:'Piksel Kılıcı',category:'Tematik',price:0,color:'#a1ff7a',accent:'#6a70ff',desc:'100 mob avı başarımıyla açılır.',unlock:'mob_100'},{id:'giant',name:'Abartı Bıçak',category:'Absürt',price:900,color:'#ffb56d',accent:'#fff0a8',desc:'Geniş görünür; gerçek menzil değişmez.',unlock:'gold'}];
const ACHIEVEMENTS=[{id:'boss_1',name:'Yarığı Sustur',desc:'1 boss öldür.',target:1,stat:'bossKills',skin:'bone'},{id:'mob_100',name:'Arena Avcısı',desc:'Toplam 100 mob öldür.',target:100,stat:'mobKills',skin:'pixel'},{id:'gold_1000',name:'Parlak Kasa',desc:'Toplam 1000 altın kazan.',target:1000,stat:'goldEarned',gold:120}];
root.RiftData={TIERS,FORMS,CLASSES,UPGRADES,MOBS,BIOMES,BOT_PROFILES,GOLD_REWARDS,COSMETICS,ACHIEVEMENTS,VERSION:3.3,FUSION:50,ACTIVE_LIMIT:99999};
})(typeof window!=='undefined'?window:globalThis);