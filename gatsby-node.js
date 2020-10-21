const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField, } = actions;

  if (node.relativePath === `resume.pdf`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });

    console.log(`Node created for resume of type "${node.internal.type}"`)

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};
