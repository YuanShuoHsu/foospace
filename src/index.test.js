import { checkout } from "./index.js";

it("Should get 0 if nothing is purchased", () => {
  const result = checkout([]);
  expect(result.totalPrice).toBe(0);
});

it("Should calculate total price correctly for multiple items", () => {
  const result = checkout(["003", "002", "003", "003", "004"]);
  const expectedTotalPrice = 232.5;
  expect(result.totalPrice).toBe(expectedTotalPrice);
});
