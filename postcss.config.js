module.exports = {
  plugins: [
    require('postcss-preset-env', {
      browsers: {
        'development': [
          'last 2 versions'
        ],
        'production': [
          '>0.2%',
          'not dead',
          'not op_mini all'
        ]
      }
    })
  ]
}
