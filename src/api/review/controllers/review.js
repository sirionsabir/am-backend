"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  async submit(ctx) {
    const data = ctx.request.body?.data || {};

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const comment = typeof data.comment === "string" ? data.comment.trim() : "";
    const rating = Number(data.rating);
    const productDocumentId =
      typeof data.product === "string" ? data.product : "";

    if (
      !name ||
      !comment ||
      !productDocumentId ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return ctx.badRequest(
        "Please enter your name, rating, comment, and product."
      );
    }

    const product = await strapi
      .documents("api::product.product")
      .findOne({
        documentId: productDocumentId,
        status: "published",
      });

    if (!product) {
      return ctx.notFound("Product not found.");
    }

    const review = await strapi
      .documents("api::review.review")
      .create({
        data: {
          name,
          rating,
          comment: [
            {
              type: "paragraph",
              children: [{ type: "text", text: comment }],
            },
          ],
          product: {
  documentId: product.documentId,
},
          isApproved: false,
        },
        status: "draft",
      });

    ctx.status = 201;
    ctx.body = { data: review };
  },
}));