const SlugGenerator = require('../slug-generator');

it('generates unique slugs on each call', () => {
    const generator = new SlugGenerator();

    const slug1 = generator.generate();
    const slug2 = generator.generate();

    expect(slug1 === slug2).toBe(false);
});
