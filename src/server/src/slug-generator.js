class SlugGenerator {
     generate() {
          return Math.random()
               .toString(36)
               .substring(4, 8);
     }
}

module.exports = SlugGenerator;
