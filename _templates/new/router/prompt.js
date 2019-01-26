module.exports = [
  {
    type: 'input',
    name: 'model',
    message: 'Model Name:(i.e. User)',
    validate(value) {
      if (!value.length) {
        return 'Vuex ORM models must have a name, better capitalized.'
      }
      if (value.indexOf('-') !== -1) {
        return 'Component names should contain one word, better capitalized.'
      }
      return true
    },
  },
]
