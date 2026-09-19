"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/reviews/submit",
      handler: "review.submit",
      config: {
        auth: false,
      },
    },
  ],
};