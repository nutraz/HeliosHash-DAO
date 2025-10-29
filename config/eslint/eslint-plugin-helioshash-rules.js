export const rules = {
  'no-raw-currency': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow raw currency strings in favor of formatting utilities',
        recommended: false,
      },
      schema: [],
      messages: {
        useFormatUtility:
          'Use formatCurrency, formatOWP, or formatINR instead of raw currency strings',
      },
    },
    create(context) {
      const patterns = [
        /₹\s*\d+/, // ₹ followed by digits
        /\$\s*\d+/, // $ followed by digits
        /€\s*\d+/, // € followed by digits
        /\d+\s*OWP/, // number + OWP
        /\d+\s*₹/,
        /\d+\s*\$/,
        /\d+\s*€/,
      ];
      function isRaw(str) {
        return patterns.some((p) => p.test(str));
      }
      return {
        Literal(node) {
          if (typeof node.value === 'string' && isRaw(node.value)) {
            context.report({ node, messageId: 'useFormatUtility' });
          }
        },
        TemplateElement(node) {
          if (node.value && node.value.raw && isRaw(node.value.raw)) {
            context.report({ node, messageId: 'useFormatUtility' });
          }
        },
      };
    },
  },
};

export default { rules };
