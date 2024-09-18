const fakeStripeApi = (amount, currency) => {
    const clientSecret = Math.random().toString(36).substring(7);
    return {
       clientSecret,
       amount,
    }
}

module.exports = fakeStripeApi;