'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/sectionHeader';
import styles from './blogs.module.scss';
import { BLOG_POSTS, BLOG_CATEGORIES } from './data';
import { useLanguage } from '@/context/LanguageContext';
import CommonCta from '@/components/commonCta';

export default function BlogsListing() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

    const filteredPosts = BLOG_POSTS.filter(post => {
        if (selectedCategory !== 'All' && post.category !== selectedCategory) {
            return false;
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = post.title.toLowerCase().includes(q);
            const matchExcerpt = post.excerpt.toLowerCase().includes(q);
            const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
            const matchAuthor = post.author.name.toLowerCase().includes(q);
            if (!matchTitle && !matchExcerpt && !matchTags && !matchAuthor) return false;
        }
        return true;
    });

    return (
        <div className={styles.blogsWrapper}>
            <div className={styles.container}>
                {/* Uniform Section Header */}
                <SectionHeader
                    as="h1"
                    badge={t('blogs.badge', 'CHRONOSX TRADING RESEARCH & INSIGHTS')}
                    title1={t('blogs.title1', 'Institutional Trading Intelligence &')}
                    title2={t('blogs.title2', 'Macro Insights')}
                    description={t('blogs.description', 'Comprehensive guides, quantitative frameworks, smart money concepts, and real-time market playbooks written by institutional traders.')}
                    align="center"
                />

                {/* Controls Bar: Search & Category Pills */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchRow}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('blogs.searchPlaceholder', 'Search trading guides, order blocks, risk models, XAUUSD...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.categoryPills}>
                        {BLOG_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`${styles.catBtn} ${selectedCategory === cat ? styles.activeCat : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Blog Post (Shown when on "All" category without search) */}
                {selectedCategory === 'All' && !searchQuery.trim() && featuredPost && (
                    <Link href={`/blogs/${featuredPost.slug}`} className={styles.featuredCard}>
                        <div className={styles.featuredContentCol}>
                            <div className={styles.featuredTopMeta}>
                                <span className={styles.featuredBadge}>FEATURED ARTICLE</span>
                                <div className={styles.metaInfo}>
                                    <span className={styles.catTag}>{featuredPost.category}</span>
                                    <span>•</span>
                                    <span>{featuredPost.readTime}</span>
                                    <span>•</span>
                                    <span>{featuredPost.publishedAt}</span>
                                </div>
                            </div>

                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.excerpt}</p>

                            <div className={styles.featuredFooter}>
                                <div className={styles.authorWrap}>
                                    <div className={styles.avatarCircle}>{featuredPost.author.avatar}</div>
                                    <div className={styles.authorText}>
                                        <span className={styles.authorName}>{featuredPost.author.name}</span>
                                        <span className={styles.authorRole}>{featuredPost.author.role}</span>
                                    </div>
                                </div>

                                <div className={styles.readMoreLink}>
                                    <span>{t('blogs.readFull', 'Read Full Analysis')}</span>
                                    <svg className={styles.readMoreArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {featuredPost.image && (
                            <div className={styles.featuredImageCol}>
                                <div className={styles.featuredImageWrap}>
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        sizes="(max-width: 900px) 100vw, 480px"
                                        className={styles.blogImg}
                                        priority
                                    />
                                    <div className={styles.imgOverlay} />
                                </div>
                            </div>
                        )}
                    </Link>
                )}

                {/* 6-Card Responsive Grid */}
                {filteredPosts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <h3>No research articles found</h3>
                        <p>{t('blogs.tryReset', 'Try searching for a different keyword or resetting category filters.')}</p>
                        <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className={styles.blogsGrid}>
                        {filteredPosts.map(post => (
                            <Link key={post.id} href={`/blogs/${post.slug}`} className={styles.blogCard}>
                                {post.image && (
                                    <div className={styles.cardImageWrap}>
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className={styles.cardImg}
                                        />
                                        <div className={styles.cardImgOverlay} />
                                        <span className={styles.categoryBadgeOverlay}>{post.category}</span>
                                    </div>
                                )}

                                <div className={styles.cardTop}>
                                    <div className={styles.cardMetaRow}>
                                        <span className={styles.publishDate}>{post.publishedAt}</span>
                                        <span className={styles.readTime}>{post.readTime}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                </div>

                                <div className={styles.cardBottom}>
                                    <div className={styles.authorInfo}>
                                        <div className={styles.miniAvatar}>{post.author.avatar}</div>
                                        <span className={styles.authorName}>{post.author.name}</span>
                                    </div>

                                    <svg className={styles.cardArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Conversion CTA */}
            <CommonCta
                badge="STAY AHEAD OF THE MARKETS"
                title1="Apply Institutional Research in"
                title2="Live Market Conditions"
                description="Harness deep chart pattern vision, quantitative risk modeling, and instant multi-asset alerts today."
                primaryBtnText="GET STARTED NOW"
                primaryBtnAction="/signup"
            />
        </div>
    );
}
