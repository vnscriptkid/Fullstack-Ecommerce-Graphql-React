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

module.exports = {
    hasAnyOfPermissions
}