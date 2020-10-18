# What is FooCart?

FooCart is widget written with TypeScript that display Cart for Products on any HTML page.

The strong sides of widget is:
* It do not require any backend language, only Google Spreadsheets to save the order and email notification
* It very easy to start using it - just put few lines of HTML code
* It have open source code - so you can take it and extend or ask for changes

[See how it works](https://drive.google.com/file/d/1vVwMlqcb6GRFhG1uCRcAvQD5Hb561eQM/view?usp=sharing).

## How start using FooCart?

1. Copy [Google FooCart Table](https://docs.google.com/spreadsheets/d/1UVQQTNUIaUxZyBc1gjBgqGaf9EuU5Onorn3wqybeFz4/edit)
2. Publish Script: open menu **Instruments > Script editor > Publish > Deploy as web app** and copy App URL
3. See next section 'Embed FooCart to web page'

## Embed FooCart to web page

For embed widget to any website page please add following code where you need replace APP_URL with App URL from previous section:

```html
<div
    id="foocart"
    data-price-template="${price}"
    data-lang="en"
    data-complete-url="APP_URL"
></div>
<script src="https://unpkg.com/foocart/dist/index.js" defer crossorigin="anonymous"></script>
```

where:

| Attribute           | Default value | Meaning                                                 |
|---------------------|---------------|---------------------------------------------------------|
| id                  | `foocart`       | Required. ID of element that contain FooCart widget.    |
| data-complete-url   | -             | Required. URL of Google Spreadsheet Items Table Script. |
| data-lang           | `en`            | Optional. Language of Cart. Available: `en`, `ua`, `ru`.      |
| data-price-template | `${price}`      | Optional. Price template for all prices in cart.        |

## Add to Cart Button

Then you ready to add Add to Cart Button. For this please add following code:

```html
<a
    href="/apple-iphone-12-pro.html"
    data-foocart-price="1099"
    data-foocart-url="https://foocart.project//apple-iphone-12-pro.html"
    data-foocart-name="Apple iPhone 12 Pro"
    data-foocart-image="https://i.citrus.ua/imgcache/size_500/uploads/shop/8/d/8d515e4a0b98bb5c151a628aada312a2.jpg"
>Apple iPhone 12 Pro</a>
```

where:

| Attribute          | Default value        | Meaning                                                               |
|--------------------|----------------------|-----------------------------------------------------------------------|
| data-foocart-url   | -                    | URL of item is the page where item description located.               |
| data-foocart-name  | innerText of element | Name of item.                                                         |
| data-foocart-id    | hash of URL and Name | ID of item is specific number or string that could identify the item. |
| data-foocart-price | `0`                    | Price of item.                                                        |
| data-foocart-image | -                    | URL of item image that will be displayed in the cart.                 |

## FooCart Callback

For get access to FooCart API please use FooCart Callback that could be defined as:

```html
<script>
  window.__foocartCallback = function(cart) {
    // Add new item
    cart.addItem({
       id: '10',
       name: 'Foo',
       price: 10
    });
  };
</script>
```

then you can use API Methods for Add, Remove items from the cart.

## FooCart API Methods

| Method                           | Arguments                                                                                                                | Returns     | Meaning                                                                                                                                         |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| addItem(item)                    | `item: {    id: string \| number,    name: string,    url: string,    count: number,    image: string,    price: number }` | Item        | Add item to cart. If item with the same ID is exists - then we just increase count of this item.                                                |
| addItemCount(itemId, count=1)    | `itemId: string \| number count: number`                                                                                   | -           | Add item count that already exists in cart. If item with ID is not present in cart - it will do nothing.                                        |
| removeItem(itemId)               | `itemId: string \| number`                                                                                                 | -           | Remove item by ID. If item is not present in cart - it will do nothing.                                                                         |
| removeItemCount(itemId, count=1) | `itemId: string \| number count: number `                                                                                  | -           | Remove item count by ID. If item count is less than zero - it will set count to 1. If item with ID is not present in cart - it will do nothing. |
| removeAllItems()                 | -                                                                                                                        | -           | Remove all items. Cart became empty.                                                                                                            |
| getItems()                       | -                                                                                                                        | Array<Item> | Just return array of items.                                                                                                                     |
| setSection(sectionId)            | `sectionId: enum(button, cart, order, complete)`                                                                           | -           | Display specific cart section.                                                                                                                  |
| getTotalPrice()                  | -                                                                                                                        | number      | Just return total price of all items.                                                                                                           |
