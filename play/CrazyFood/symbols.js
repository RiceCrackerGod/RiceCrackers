// Define game symbols and their properties
const symbolsConfig = {
    wild: {
      emoji: '🍓',
      type: 'wild',
      name: 'Wild',
      payouts: [10, 50, 200, 500, 1000],
      weight: 0.5 // Lower weight to maintain 95% RTP
    },
    scatter: {
      emoji: '🌟',
      type: 'scatter',
      name: 'Scatter',
      payouts: [0, 5, 20, 50, 100],
      weight: 0.8
    },
    regular: {
      // Original symbols (higher value)
      burger: {
        emoji: '🍔',
        type: 'regular',
        name: 'Burger',
        payouts: [5, 25, 100, 250, 500],
        weight: 1.5
      },
      pizza: {
        emoji: '🍕',
        type: 'regular',
        name: 'Pizza',
        payouts: [5, 20, 75, 200, 400],
        weight: 2
      },
      iceCream: {
        emoji: '🍦',
        type: 'regular',
        name: 'Ice Cream',
        payouts: [3, 15, 50, 150, 300],
        weight: 2.5
      },
      taco: {
        emoji: '🌮',
        type: 'regular',
        name: 'Taco',
        payouts: [2, 10, 30, 100, 200],
        weight: 3
      },
      chicken: {
        emoji: '🍗',
        type: 'regular',
        name: 'Chicken',
        payouts: [2, 10, 25, 75, 150],
        weight: 3.5
      },
      donut: {
        emoji: '🍩',
        type: 'regular',
        name: 'Donut',
        payouts: [1, 8, 20, 60, 120],
        weight: 4
      },
      sushi: {
        emoji: '🍣',
        type: 'regular',
        name: 'Sushi',
        payouts: [1, 5, 15, 50, 100],
        weight: 4.5
      },
      watermelon: {
        emoji: '🍉',
        type: 'regular',
        name: 'Watermelon',
        payouts: [1, 5, 10, 40, 80],
        weight: 5
      },
      cupcake: {
        emoji: '🧁',
        type: 'regular',
        name: 'Cupcake',
        payouts: [1, 4, 8, 30, 60],
        weight: 5.5
      },
      
      // Additional 69 food symbols
      apple: {
        emoji: '🍎',
        type: 'regular',
        name: 'Apple',
        payouts: [1, 3, 7, 25, 50],
        weight: 6
      },
      pear: {
        emoji: '🍐',
        type: 'regular',
        name: 'Pear',
        payouts: [1, 3, 7, 25, 50],
        weight: 6.5
      },
      orange: {
        emoji: '🍊',
        type: 'regular',
        name: 'Orange',
        payouts: [1, 3, 7, 25, 45],
        weight: 7
      },
      lemon: {
        emoji: '🍋',
        type: 'regular',
        name: 'Lemon',
        payouts: [1, 3, 7, 20, 45],
        weight: 7.5
      },
      banana: {
        emoji: '🍌',
        type: 'regular',
        name: 'Banana',
        payouts: [1, 3, 6, 20, 40],
        weight: 8
      },
      pineapple: {
        emoji: '🍍',
        type: 'regular',
        name: 'Pineapple',
        payouts: [1, 3, 6, 20, 40],
        weight: 8.5
      },
      mango: {
        emoji: '🥭',
        type: 'regular',
        name: 'Mango',
        payouts: [1, 3, 6, 18, 35],
        weight: 9
      },
      coconut: {
        emoji: '🥥',
        type: 'regular',
        name: 'Coconut',
        payouts: [1, 3, 6, 18, 35],
        weight: 9.5
      },
      kiwi: {
        emoji: '🥝',
        type: 'regular',
        name: 'Kiwi',
        payouts: [1, 3, 6, 15, 30],
        weight: 10
      },
      avocado: {
        emoji: '🥑',
        type: 'regular',
        name: 'Avocado',
        payouts: [1, 3, 5, 15, 30],
        weight: 10.5
      },
      cucumber: {
        emoji: '🥒',
        type: 'regular',
        name: 'Cucumber',
        payouts: [1, 3, 5, 15, 25],
        weight: 11
      },
      carrot: {
        emoji: '🥕',
        type: 'regular',
        name: 'Carrot',
        payouts: [1, 3, 5, 15, 25],
        weight: 11.5
      },
      corn: {
        emoji: '🌽',
        type: 'regular',
        name: 'Corn',
        payouts: [1, 3, 5, 12, 25],
        weight: 12
      },
      hotPepper: {
        emoji: '🌶️',
        type: 'regular',
        name: 'Hot Pepper',
        payouts: [1, 3, 5, 12, 20],
        weight: 12.5
      },
      broccoli: {
        emoji: '🥦',
        type: 'regular',
        name: 'Broccoli',
        payouts: [1, 3, 5, 12, 20],
        weight: 13
      },
      tomato: {
        emoji: '🍅',
        type: 'regular',
        name: 'Tomato',
        payouts: [1, 3, 5, 10, 18],
        weight: 13.5
      },
      eggplant: {
        emoji: '🍆',
        type: 'regular',
        name: 'Eggplant',
        payouts: [1, 3, 5, 10, 18],
        weight: 14
      },
      potato: {
        emoji: '🥔',
        type: 'regular',
        name: 'Potato',
        payouts: [1, 3, 5, 10, 15],
        weight: 14.5
      },
      sweetPotato: {
        emoji: '🍠',
        type: 'regular',
        name: 'Sweet Potato',
        payouts: [1, 3, 5, 10, 15],
        weight: 15
      },
      mushroom: {
        emoji: '🍄',
        type: 'regular',
        name: 'Mushroom',
        payouts: [1, 2, 5, 8, 15],
        weight: 15.5
      },
      peanuts: {
        emoji: '🥜',
        type: 'regular',
        name: 'Peanuts',
        payouts: [1, 2, 5, 8, 12],
        weight: 16
      },
      chestnut: {
        emoji: '🌰',
        type: 'regular',
        name: 'Chestnut',
        payouts: [1, 2, 5, 8, 12],
        weight: 16.5
      },
      bread: {
        emoji: '🍞',
        type: 'regular',
        name: 'Bread',
        payouts: [1, 2, 4, 8, 10],
        weight: 17
      },
      croissant: {
        emoji: '🥐',
        type: 'regular',
        name: 'Croissant',
        payouts: [1, 2, 4, 8, 10],
        weight: 17.5
      },
      baguette: {
        emoji: '🥖',
        type: 'regular',
        name: 'Baguette',
        payouts: [1, 2, 4, 7, 10],
        weight: 18
      },
      pretzel: {
        emoji: '🥨',
        type: 'regular',
        name: 'Pretzel',
        payouts: [1, 2, 4, 7, 8],
        weight: 18.5
      },
      bagel: {
        emoji: '🥯',
        type: 'regular',
        name: 'Bagel',
        payouts: [1, 2, 4, 7, 8],
        weight: 19
      },
      pancakes: {
        emoji: '🥞',
        type: 'regular',
        name: 'Pancakes',
        payouts: [1, 2, 4, 6, 8],
        weight: 19.5
      },
      waffle: {
        emoji: '🧇',
        type: 'regular',
        name: 'Waffle',
        payouts: [1, 2, 4, 6, 8],
        weight: 20
      },
      cheese: {
        emoji: '🧀',
        type: 'regular',
        name: 'Cheese',
        payouts: [1, 2, 4, 6, 7],
        weight: 20.5
      },
      meat: {
        emoji: '🍖',
        type: 'regular',
        name: 'Meat',
        payouts: [1, 2, 4, 6, 7],
        weight: 21
      },
      bacon: {
        emoji: '🥓',
        type: 'regular',
        name: 'Bacon',
        payouts: [1, 2, 3, 6, 7],
        weight: 21.5
      },
      hotdog: {
        emoji: '🌭',
        type: 'regular',
        name: 'Hotdog',
        payouts: [1, 2, 3, 5, 7],
        weight: 22
      },
      sandwich: {
        emoji: '🥪',
        type: 'regular',
        name: 'Sandwich',
        payouts: [1, 2, 3, 5, 6],
        weight: 22.5
      },
      falafel: {
        emoji: '🧆',
        type: 'regular',
        name: 'Falafel',
        payouts: [1, 2, 3, 5, 6],
        weight: 23
      },
      egg: {
        emoji: '🥚',
        type: 'regular',
        name: 'Egg',
        payouts: [1, 2, 3, 5, 6],
        weight: 23.5
      },
      friedEgg: {
        emoji: '🍳',
        type: 'regular',
        name: 'Fried Egg',
        payouts: [1, 2, 3, 4, 6],
        weight: 24
      },
      shallowPan: {
        emoji: '🥘',
        type: 'regular',
        name: 'Shallow Pan',
        payouts: [1, 2, 3, 4, 5],
        weight: 24.5
      },
      pot: {
        emoji: '🍲',
        type: 'regular',
        name: 'Pot',
        payouts: [1, 2, 3, 4, 5],
        weight: 25
      },
      bowl: {
        emoji: '🥣',
        type: 'regular',
        name: 'Bowl',
        payouts: [1, 2, 3, 4, 5],
        weight: 25.5
      },
      greenSalad: {
        emoji: '🥗',
        type: 'regular',
        name: 'Green Salad',
        payouts: [1, 2, 3, 4, 5],
        weight: 26
      },
      popcorn: {
        emoji: '🍿',
        type: 'regular',
        name: 'Popcorn',
        payouts: [1, 2, 3, 4, 5],
        weight: 26.5
      },
      butter: {
        emoji: '🧈',
        type: 'regular',
        name: 'Butter',
        payouts: [1, 2, 3, 4, 5],
        weight: 27
      },
      salt: {
        emoji: '🧂',
        type: 'regular',
        name: 'Salt',
        payouts: [1, 2, 3, 4, 5],
        weight: 27.5
      },
      cannedFood: {
        emoji: '🥫',
        type: 'regular',
        name: 'Canned Food',
        payouts: [1, 2, 3, 4, 5],
        weight: 28
      },
      burrito: {
        emoji: '🌯',
        type: 'regular',
        name: 'Burrito',
        payouts: [1, 2, 3, 4, 5],
        weight: 28.5
      },
      tamale: {
        emoji: '🫔',
        type: 'regular',
        name: 'Tamale',
        payouts: [1, 2, 3, 4, 5],
        weight: 29
      },
      stuffedFlatbread: {
        emoji: '🥙',
        type: 'regular',
        name: 'Stuffed Flatbread',
        payouts: [1, 2, 3, 4, 5],
        weight: 29.5
      },
      fries: {
        emoji: '🍟',
        type: 'regular',
        name: 'Fries',
        payouts: [1, 2, 3, 4, 5],
        weight: 30
      },
      ramen: {
        emoji: '🍜',
        type: 'regular',
        name: 'Ramen',
        payouts: [1, 2, 3, 4, 5],
        weight: 30.5
      },
      steamingBowl: {
        emoji: '🍚',
        type: 'regular',
        name: 'Steaming Bowl',
        payouts: [1, 2, 3, 4, 4],
        weight: 31
      },
      spaghetti: {
        emoji: '🍝',
        type: 'regular',
        name: 'Spaghetti',
        payouts: [1, 2, 3, 4, 4],
        weight: 31.5
      },
      dumpling: {
        emoji: '🥟',
        type: 'regular',
        name: 'Dumpling',
        payouts: [1, 2, 3, 4, 4],
        weight: 32
      },
      fortune: {
        emoji: '🥠',
        type: 'regular',
        name: 'Fortune Cookie',
        payouts: [1, 2, 3, 4, 4],
        weight: 32.5
      },
      takeout: {
        emoji: '🥡',
        type: 'regular',
        name: 'Takeout Box',
        payouts: [1, 2, 3, 4, 4],
        weight: 33
      },
      oyster: {
        emoji: '🦪',
        type: 'regular',
        name: 'Oyster',
        payouts: [1, 2, 3, 4, 4],
        weight: 33.5
      },
      softIceCream: {
        emoji: '🍨',
        type: 'regular',
        name: 'Soft Ice Cream',
        payouts: [1, 2, 3, 4, 4],
        weight: 34
      },
      shaved: {
        emoji: '🍧',
        type: 'regular',
        name: 'Shaved Ice',
        payouts: [1, 2, 3, 3, 4],
        weight: 34.5
      },
      custard: {
        emoji: '🍮',
        type: 'regular',
        name: 'Custard',
        payouts: [1, 2, 3, 3, 4],
        weight: 35
      },
      honey: {
        emoji: '🍯',
        type: 'regular',
        name: 'Honey Pot',
        payouts: [1, 2, 3, 3, 4],
        weight: 35.5
      },
      shortcake: {
        emoji: '🍰',
        type: 'regular',
        name: 'Shortcake',
        payouts: [1, 2, 3, 3, 4],
        weight: 36
      },
      birthdayCake: {
        emoji: '🎂',
        type: 'regular',
        name: 'Birthday Cake',
        payouts: [1, 2, 3, 3, 4],
        weight: 36.5
      },
      pie: {
        emoji: '🥧',
        type: 'regular',
        name: 'Pie',
        payouts: [1, 2, 3, 3, 3],
        weight: 37
      },
      chocolate: {
        emoji: '🍫',
        type: 'regular',
        name: 'Chocolate',
        payouts: [1, 2, 3, 3, 3],
        weight: 37.5
      },
      candy: {
        emoji: '🍬',
        type: 'regular',
        name: 'Candy',
        payouts: [1, 2, 3, 3, 3],
        weight: 38
      },
      lollipop: {
        emoji: '🍭',
        type: 'regular',
        name: 'Lollipop',
        payouts: [1, 2, 3, 3, 3],
        weight: 38.5
      },
      cookie: {
        emoji: '🍪',
        type: 'regular',
        name: 'Cookie',
        payouts: [1, 2, 2, 3, 3],
        weight: 39
      },
      teapot: {
        emoji: '🫖',
        type: 'regular',
        name: 'Teapot',
        payouts: [1, 2, 2, 3, 3],
        weight: 39.5
      },
      tea: {
        emoji: '🍵',
        type: 'regular',
        name: 'Teacup',
        payouts: [1, 2, 2, 3, 3],
        weight: 40
      },
      sake: {
        emoji: '🍶',
        type: 'regular',
        name: 'Sake',
        payouts: [1, 2, 2, 3, 3],
        weight: 40.5
      }
    }
  };