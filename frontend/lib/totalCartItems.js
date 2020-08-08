export default function totalCartItems(cart) {
    return cart.reduce((prev, cur) => prev + cur.quantity, 0)
}