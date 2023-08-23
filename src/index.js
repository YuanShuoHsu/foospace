import database from "./database.json";

export const checkout = (productIDs = []) => {
  const products = database.products;
  const cartItems = [];

  for (const id of productIDs) {
    const { name, price } = products[id];
    cartItems.push({ id, name, price });
  }

  const discounts = {};
  const threshold = 3;

  for (let index = 0; index < cartItems.length; index++) {
    const item = cartItems[index];
    const { id } = item;

    if (cartItems.length < threshold) {
      if (discounts[id] === undefined) {
        discounts[id] = index;
      } else {
        item.price *= 0.5;
      }
    } else {
      if (discounts[id] === undefined) {
        discounts[id] = index;
        item.price -= 5;
      } else if (discounts[id] !== -1) {
        item.price *= 0.5;
        cartItems[discounts[id]].price += 5;
        discounts[id] = -1;
      } else {
        item.price -= 5;
      }
    }
  }

  const cart = cartItems.map((item, index) => ({
    index: index + 1,
    id: item.id,
    name: item.name,
    originalPrice: products[item.id].price,
    finalPrice: item.price
  }));

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return { cart, totalPrice };
};

const result = checkout(["003", "002", "003", "003", "004"]);

const appContainer = document.getElementById("app");

const priceElement = `<p>價格。以本範例為例，價格為：$${result.totalPrice}</p>`;

const emptyLine = "<p>\n</p>";

const tableElement = `
  <table style="text-align: center;">
    <thead>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>原價</th>
        <th>活動價</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="4">
          ----------------------------------------------------
        </td>
      </tr>
      ${result.cart
        .map(
          ({ index, id, originalPrice, finalPrice }) => `
            <tr>
              <td>${index}</td>
              <td>${id}</td>
              <td>${originalPrice}</td>
              <td>${finalPrice}</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

if (appContainer) {
  appContainer.innerHTML = priceElement + emptyLine + tableElement;
}
