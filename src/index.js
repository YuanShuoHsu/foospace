import database from "./database.json";

export const checkout = (productIDs = []) => {
  const products = database.products;
  const discounts = {};
  const threshold = 3;

  const cartItems = productIDs.map((id, index) => {
    const { name, price } = products[id];

    return {
      index: index + 1,
      id,
      name,
      originalPrice: price,
      finalPrice: price,
    };
  });

  if (cartItems.length < threshold) {
    cartItems.forEach((item, index) => {
      const { id } = item;

      if (discounts[id] === undefined) {
        discounts[id] = index;
      } else {
        item.finalPrice *= 0.5;
      }
    });
  } else {
    cartItems.forEach((item, index) => {
      const { id } = item;

      if (discounts[id] === undefined) {
        discounts[id] = index;
        item.finalPrice -= 5;
      } else if (discounts[id] !== -1) {
        const discountedItem = cartItems[discounts[id]];
        discountedItem.finalPrice += 5;
        item.finalPrice *= 0.5;
        discounts[id] = -1;
      } else {
        item.finalPrice -= 5;
      }
    });
  }

  return {
    cart: cartItems,
    totalPrice: cartItems.reduce((total, item) => total + item.finalPrice, 0),
  };
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
