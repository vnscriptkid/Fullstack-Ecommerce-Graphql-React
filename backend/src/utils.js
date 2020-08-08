function hasAnyOfPermissions(user, neededPermissions) {
    // users.permissions['c', 'd'], ['a', 'b']
    const includedPermissions = user.permissions.filter(permission => neededPermissions.includes(permission));

    if (includedPermissions.length === 0) {
        throw new Error(`
            You doesn't have any of the needed permissions ${neededPermissions}
            You have: ${user.permissions}
        `);
    }
}

function calcTotalPrice(cart) {
    return cart.reduce((tally, cartItem) => {
      if (!cartItem.item) return tally;
      return tally + cartItem.quantity * cartItem.item.price;
    }, 0);
  }

module.exports = {
    hasAnyOfPermissions,
    calcTotalPrice
}