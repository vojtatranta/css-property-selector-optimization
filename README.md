# CSS property and class optimimalization experiment

Has anyone thought about optimizing the way how css are "translated" into class names?

For example, if I have lots of declarations that share some property:
```css
.some-class {
  font-weight: bold,
}

.other-class {
  width: 300px;
  font-weight: bold;
}

.text-class {
  font-weight: bold;
  text-decoration: underline;
}
```
with:

```html
<div class="other-class"></div>
<span class="text-class"></span>
<span class="some-class"></span>

```

This could be obviously translated into this:
```css
.font-weight--bold {
  font-weight: bold;
}

.other-class {
  width: 300px;
}

.text-class {
  text-decoration: underline;
}
```

and used as:
```html
<div class="font-weight--bold other-class"></div>
<span class="font-weight--bold text-class"></span>
<span class="font-weight--bold"></span>

```

I know that it seems as small optimization, but when we imagine large stylesheets, it could save few kilobytes, even more when combined with some selector shortening.

What do you think?

Here in the repo are two example files `fixtures/small.css` and `fixtures/style.css`. The second file is about `124kB`.

I managed to squeeze size of the `styles.css` from `147kB` to `70kB`.

The output of this function `res.css` is not working. Selectors are not properly escaped, but this is just an expriment a proof of concept
and it is an easy fix anyway.

## So, what do you think?
Make it sense to create some Webpack plugin that does this? Or not? The problem is that this approach might only work with some
variantion of CSS in JS, because in order to make this work we have to apply newly created selector onto elements itself. So no global css is allowed.

Please please give me your feedback as an [issue](https://github.com/vojtatranta/css-property-selector-optimization/issues)!




