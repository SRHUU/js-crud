// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// _U_S_E_R_

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query
  // console.log(typeof id)

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

// _P_R_O_D_U_C_T_

// ================================================================

class Product {
  static #list = []

  constructor(name, price, descritption) {
    this.id = Math.floor(Math.random() * 90000 + 10000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = descritption
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { price, name, description },
  ) => {
    if (price) {
      product.price = price
    }
    if (name) {
      product.name = name
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  if (
    !product.name ||
    !product.price ||
    !product.description
  ) {
    result = false
    text = false
  } else {
    result = true
    text = true
  }

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Успішне виконання дії'
      : 'Помилка виконання дії',
    comment: text
      ? 'Товар було успішно створено'
      : 'Товар не було створено',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const products = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    data: {
      products,

      // {
      //   name: 'Стильна сукня',
      //   description:
      //     'Елегантна сукня з натуральної тканини для особливих випадків.',
      //   price: 1500,
      // },
      // {
      //   name: 'Спортивні кросівки',
      //   description:
      //     'Зручні та стильні кросівки для активного способу життя.',
      //   price: 1200,
      // },
      // {
      //   name: 'Сонячні окуляри',
      //   description:
      //     'Модні окуляри з високоякісними лінзами для захисту чей від сонця.',
      //   id: 2468135790,
      //   price: 800,
      // },
      // {
      //   name: 'Чоловічий годинник',
      //   description:
      //     'Елегантний годинник з мехнічним механізмом та сталевим браслетом.',
      //   id: 8024679135,
      //   price: 2500,
      // },
      // {
      //   name: 'Жіночий рюкзак',
      //   description:
      //     'Стильний рюкзак з великим відділення та кишенями.',
      //   price: 900,
      // },
      // {
      //   name: 'Парасолька',
      //   description:
      //     'Компактна парасолька з автоматичним механізмом.',

      //   price: 350,
      // },
      // {
      //   name: 'Столові прибори',
      //   description:
      //     'Набір столових приборів зі сталі, виготовлені в класичному стилі.',
      //   price: 600,
      // },
      // {
      //   name: 'Шкіряний гаманець',
      //   description:
      //     'Елегантний гаманець з натуральної шкіри з багтьма відділеннями.',
      //   price: 400,
      // },
      // {
      //   name: 'Фітнес-браслет',
      //   description:
      //     'Браслет для вдстеження активності та здоров`я.',
      //   price: 700,
      // },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))
  console.log(product)

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка виконання дії',
      comment: 'Товар з таким ID не знайдено',
    })
  }
})
// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  if (product) {
    res.render('alert', {
      style: 'alert',
      info: 'Оновлення успішне',
      comment: 'Дані товару були оновлені',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка виконання дії',
      comment: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  console.log(id)

  const product = Product.deleteById(Number(id))

  if (product) {
    res.render('alert', {
      style: 'alert',
      info: 'Видалення успішне',
      comment: 'Товар був успішно видалений',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка виконання дії',
      comment: 'Товар з таким ID не знайдено',
    })
  }
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
