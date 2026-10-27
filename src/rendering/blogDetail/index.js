'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blogDetail.module.scss';
import { BLOG_POSTS } from '../blogs/data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { toast } from '@/components/toast';

export default function BlogDetailView({ slug }) {
    const postIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
    const post = BLOG_POSTS[postIndex] || BLOG_POSTS[0];

    const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
    const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Article link copied to clipboard!');
        }
    };

    return (
        <div className={styles.detailWrapper}>
            <div className={styles.container}>
                {/* Breadcrumbs */}
                <div className={styles.breadcrumb}>
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/blogs">Research & Insights</Link>
                    <span>/</span>
                    <span>{post.category}</span>
                </div>

                {/* Article Header */}
                <div className={styles.articleHeader}>
                    <div className={styles.metaBadgeRow}>
                        <span className={styles.categoryBadge}>{post.category}</span>
                        <span className={styles.publishDate}>{post.publishedAt}</span>
                        <span>•</span>
                        <span className={styles.readTime}>{post.readTime}</span>
                    </div>

                    <h1>{post.title}</h1>

                    {/* Author & Share Bar */}
                    <div className={styles.authorProfileBar}>
                        <div className={styles.authorLeft}>
                            <div className={styles.authorAvatar}>{post.author.avatar}</div>
                            <div className={styles.authorMeta}>
                                <span className={styles.name}>{post.author.name}</span>
                                <span className={styles.role}>{post.author.role}</span>
                            </div>
                        </div>

                        <div className={styles.shareGroup}>
                            <button type="button" className={styles.shareBtn} onClick={handleShare}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                                <span>Share Article</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Cover Image */}
                {post.image && (
                    <div className={styles.articleCoverImageWrap}>
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 1200px) 100vw, 1180px"
                            className={styles.articleCoverImg}
                            priority
                        />
                        <div className={styles.coverImgOverlay} />
                    </div>
                )}

                {/* Executive Summary Takeaways Box */}
                {post.summary && (
                    <div className={styles.takeawaysBox}>
                        <div className={styles.takeawaysHeader}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <span>Executive Summary & Research Thesis</span>
                        </div>
                        <p>{post.summary}</p>
                    </div>
                )}

                {/* Article Body & Sidebar Grid */}
                <div className={styles.articleLayout}>
                    <article className={styles.articleBody}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {post.content}
                        </ReactMarkdown>
                    </article>

                    {/* Sidebar CTA & Tags */}
                    <aside className={styles.sidebarWidget}>
                        <div className={styles.ctaCard}>
                            <h4>Deploy on TraderMaster AI Desk</h4>
                            <p>Test institutional smart money order blocks and chart vision scanning in real-time.</p>
                            <Link href="/ai-chart-scanner" className={styles.ctaBtn}>
                                <span>Launch AI Trade Vision</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                            <div className={styles.tagsCard}>
                                <h5>Article Topics</h5>
                                <div className={styles.tagsWrap}>
                                    {post.tags.map(t => (
                                        <span key={t} className={styles.tag}>#{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                {/* Next / Previous Article Navigation */}
                <div className={styles.articleFooterNav}>
                    {prevPost ? (
                        <Link href={`/blogs/${prevPost.slug}`} className={styles.navBtn}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Previous: {prevPost.title.slice(0, 32)}...</span>
                        </Link>
                    ) : <div />}

                    {nextPost ? (
                        <Link href={`/blogs/${nextPost.slug}`} className={styles.navBtn}>
                            <span>Next: {nextPost.title.slice(0, 32)}...</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
}
