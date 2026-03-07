require('dotenv').config();
const { sequelize, Post, Category, Comment } = require('../models');

const categories = [
  { name: 'Kubernetes', slug: 'kubernetes' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Docker', slug: 'docker' },
  { name: 'CI/CD', slug: 'ci-cd' },
];

const posts = [
  {
    title: 'Getting Started with Kubernetes',
    slug: 'getting-started-with-kubernetes',
    content: 'Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. In this post, we explore the fundamentals of Kubernetes architecture, including pods, services, and deployments.\n\nKubernetes was originally designed by Google and is now maintained by the Cloud Native Computing Foundation (CNCF). It provides a framework for running distributed systems resiliently, handling scaling and failover for your applications.',
    excerpt: 'Learn the fundamentals of Kubernetes architecture and core concepts.',
    author: 'Admin',
    published: true,
    categoryIds: [1, 2],
  },
  {
    title: 'GitOps with ArgoCD',
    slug: 'gitops-with-argocd',
    content: 'GitOps is a way of implementing continuous deployment for cloud-native applications. It uses Git as a single source of truth for declarative infrastructure and applications. ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes.\n\nArgoCD follows the GitOps pattern of using Git repositories as the source of truth for defining the desired application state. It automates the deployment of the desired application states in the specified target environments.',
    excerpt: 'Discover how ArgoCD enables GitOps-based continuous deployment.',
    author: 'Admin',
    published: true,
    categoryIds: [2, 4],
  },
  {
    title: 'Docker Containers Explained',
    slug: 'docker-containers-explained',
    content: 'Docker containers provide a lightweight way to package applications with their dependencies. Unlike virtual machines, containers share the host OS kernel, making them much more efficient in terms of resource usage.\n\nThis post covers Docker images, containers, volumes, and networking fundamentals.',
    excerpt: 'Understanding Docker containers and how they differ from virtual machines.',
    author: 'Admin',
    published: true,
    categoryIds: [3],
  },
  {
    title: 'Building CI/CD Pipelines with GitHub Actions',
    slug: 'building-cicd-pipelines-github-actions',
    content: 'GitHub Actions makes it easy to automate your software workflows. In this draft post, we will walk through creating a complete CI/CD pipeline that builds, tests, and deploys a containerized application.',
    excerpt: 'A guide to building automated pipelines with GitHub Actions.',
    author: 'Admin',
    published: false,
    categoryIds: [4, 2],
  },
];

const comments = [
  { postSlug: 'getting-started-with-kubernetes', authorName: 'Reader', content: 'Great introduction! Very helpful for beginners.' },
  { postSlug: 'getting-started-with-kubernetes', authorName: 'DevOps Engineer', content: 'I would also recommend looking into Helm for managing K8s applications.' },
  { postSlug: 'gitops-with-argocd', authorName: 'Cloud Enthusiast', content: 'ArgoCD has been a game changer for our team!' },
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset');

    const createdCategories = await Category.bulkCreate(categories);
    console.log(`Created ${createdCategories.length} categories`);

    for (const postData of posts) {
      const { categoryIds, ...data } = postData;
      const post = await Post.create(data);
      if (categoryIds) {
        await post.setCategories(categoryIds);
      }
    }
    console.log(`Created ${posts.length} posts`);

    for (const commentData of comments) {
      const post = await Post.findOne({ where: { slug: commentData.postSlug } });
      if (post) {
        await Comment.create({
          postId: post.id,
          authorName: commentData.authorName,
          content: commentData.content,
        });
      }
    }
    console.log(`Created ${comments.length} comments`);

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
