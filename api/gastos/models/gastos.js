'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getExpirationDate = async ( dataDate, cardId) => {
  const card = await strapi.query('cartao').findOne({ id: cardId }, []);
  const [ year, month, day ] = dataDate.split('-');
  const date = new Date(dataDate);
  const bestDayForPurchase = new Date(
    parseInt(year),
    parseInt(month) - (parseInt(day) > card.expiration_day ? 0 : 1),
    card.expiration_day-card.days_before_expiration_to_buy,
  )
  date.setUTCHours(bestDayForPurchase.getUTCHours()); //fix timezone
  return (new Date(
    parseInt(year),
    parseInt(month) - (parseInt(day) > card.expiration_day ? 0 : 1) + (date.valueOf() >= bestDayForPurchase.valueOf() ? 1 : 0),
    card.expiration_day,
  ));
}

module.exports = {

  lifecycles: {

    async beforeCreate(data) {
      if (data.date && data.cartao) {
        data.expiration_date = await getExpirationDate( data.date, data.cartao );
      }
      if (data.expiration_date) {
        const expiration_month = new Date(data.expiration_date);
        expiration_month.setDate(1);
        data.expiration_month = expiration_month;
      }

    },
    async beforeUpdate(params, data) {
      if (data.date && data.cartao && !data.expiration_date) {
        data.expiration_date = await getExpirationDate( data.date, data.cartao );
      }
      if (data.expiration_date) {
        const expiration_month = new Date(data.expiration_date);
        expiration_month.setDate(1);
        data.expiration_month = expiration_month;
      }
    },
  },

};
