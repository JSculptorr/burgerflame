/* ============================================
   BURGER FLAME — Product Catalog
   Add/edit your products here
   ============================================ */

const PRODUCTS = [
    // ========== БУРГЕРЫ ==========
    {
        id: 'b1',
        category: 'burgers',
        name: 'FLAME XL',
        desc: 'Сочная говяжья котлета 200г, бекон, плавленый сыр чеддер, томаты, фирменный соус BBQ',
        price: 590,
        oldPrice: 790,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop',
        badges: ['hot', 'sale'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'b2',
        category: 'burgers',
        name: 'BLACK BEAST',
        desc: 'Чёрная угольная булочка, двойная котлета, сыр гауда, карамелизованный лук',
        price: 690,
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&q=80&auto=format&fit=crop',
        badges: ['new'],
        rating: 4.8,
        bestseller: true
    },
    {
        id: 'b3',
        category: 'burgers',
        name: 'CLASSIC CHEESE',
        desc: 'Классический бургер с говядиной, чеддером, салатом айсберг и нашим фирменным соусом',
        price: 390,
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=80&auto=format&fit=crop',
        rating: 4.7
    },
    {
        id: 'b4',
        category: 'burgers',
        name: 'CHICKEN CRUNCH',
        desc: 'Хрустящая куриная котлета в панировке, авокадо, маринованные огурцы, соус ранч',
        price: 450,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80&auto=format&fit=crop',
        badges: ['hot'],
        rating: 4.8
    },

    // ========== ПИЦЦА ==========
    {
        id: 'p1',
        category: 'pizza',
        name: 'PEPPERONI FIRE',
        desc: 'Острая пепперони, моцарелла, чили перец, томатный соус сан-марцано, орегано',
        price: 690,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80&auto=format&fit=crop',
        badges: ['hot'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'p2',
        category: 'pizza',
        name: 'QUATTRO FORMAGGI',
        desc: 'Четыре сыра: моцарелла, горгонзола, пармезан, рикотта на сливочном соусе',
        price: 790,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format&fit=crop',
        rating: 4.8
    },
    {
        id: 'p3',
        category: 'pizza',
        name: 'BBQ CHICKEN',
        desc: 'Куриное филе на гриле, бекон, красный лук, соус барбекю, моцарелла',
        price: 720,
        oldPrice: 890,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
        badges: ['sale'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'p4',
        category: 'pizza',
        name: 'MARGHERITA',
        desc: 'Классика: томаты, моцарелла фьор-ди-латте, свежий базилик, оливковое масло',
        price: 490,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80&auto=format&fit=crop',
        rating: 4.7
    },

    // ========== ДОНЕРЫ ==========
    {
        id: 'd1',
        category: 'doner',
        name: 'BEEF DÖNER',
        desc: 'Сочное говяжье мясо с гриля, овощи, фирменный йогуртовый соус в свежем лаваше',
        price: 350,
        image: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=600&q=80&auto=format&fit=crop',
        badges: ['hot'],
        rating: 4.8
    },
    {
        id: 'd2',
        category: 'doner',
        name: 'CHICKEN DÖNER',
        desc: 'Маринованная курица, свежие овощи, чесночный соус, лаваш на углях',
        price: 290,
        image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&q=80&auto=format&fit=crop',
        rating: 4.7,
        bestseller: true
    },
    {
        id: 'd3',
        category: 'doner',
        name: 'MIX DÖNER XL',
        desc: 'Микс из курицы и говядины, тройная порция мяса, овощи и три фирменных соуса',
        price: 490,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&auto=format&fit=crop',
        badges: ['new'],
        rating: 4.9
    },

    // ========== КОМБО ==========
    {
        id: 'c1',
        category: 'combo',
        name: 'FAMILY SET',
        desc: '4 бургера на выбор, картофель фри 4 порции, наггетсы и 4 напитка',
        price: 1990,
        oldPrice: 2490,
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&auto=format&fit=crop',
        badges: ['top', 'sale'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'c2',
        category: 'combo',
        name: 'FLAME COMBO',
        desc: 'Бургер FLAME XL, картофель фри L, луковые кольца и большой напиток',
        price: 890,
        image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&q=80&auto=format&fit=crop',
        badges: ['hot'],
        rating: 4.8
    },
    {
        id: 'c3',
        category: 'combo',
        name: 'DUO BOX',
        desc: 'Два бургера на выбор, две порции картофеля и два напитка',
        price: 1190,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80&auto=format&fit=crop',
        rating: 4.7
    },

    // ========== НАПИТКИ ==========
    {
        id: 'dr1',
        category: 'drinks',
        name: 'COLA CLASSIC',
        desc: 'Классическая кола, 0.5 л, ледяная подача',
        price: 120,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80&auto=format&fit=crop',
        rating: 4.6
    },
    {
        id: 'dr2',
        category: 'drinks',
        name: 'FRESH LEMONADE',
        desc: 'Авторский лимонад с мятой, имбирём и лаймом, 0.5 л',
        price: 220,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80&auto=format&fit=crop',
        badges: ['new'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'dr3',
        category: 'drinks',
        name: 'MILKSHAKE OREO',
        desc: 'Молочный коктейль с печеньем Oreo, взбитыми сливками и шоколадом',
        price: 290,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80&auto=format&fit=crop',
        badges: ['hot'],
        rating: 4.9
    },
    {
        id: 'dr4',
        category: 'drinks',
        name: 'ICED COFFEE',
        desc: 'Холодный кофе с молоком и льдом, эспрессо двойной экстракции',
        price: 250,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80&auto=format&fit=crop',
        rating: 4.7
    },

    // ========== ДЕСЕРТЫ ==========
    {
        id: 'ds1',
        category: 'dessert',
        name: 'CHOCOLATE LAVA',
        desc: 'Шоколадный фондан с жидкой начинкой, шарик ванильного мороженого, ягоды',
        price: 350,
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80&auto=format&fit=crop',
        badges: ['top'],
        rating: 4.9,
        bestseller: true
    },
    {
        id: 'ds2',
        category: 'dessert',
        name: 'CHEESECAKE NY',
        desc: 'Классический нью-йоркский чизкейк с малиновым соусом',
        price: 290,
        image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&q=80&auto=format&fit=crop',
        rating: 4.8
    },
    {
        id: 'ds3',
        category: 'dessert',
        name: 'TIRAMISU',
        desc: 'Итальянский тирамису с маскарпоне, бисквит савоярди, какао',
        price: 320,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80&auto=format&fit=crop',
        badges: ['new'],
        rating: 4.8
    }
];

// Make available globally
window.PRODUCTS = PRODUCTS;
