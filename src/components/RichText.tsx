import React from 'react';
import Image from 'next/image';

interface RichTextProps {
  content: any;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) return null;

  const renderChildren = (children: any[]) => {
    return children.map((node, index) => {
      if (node.type === 'text') {
        let text: React.ReactNode = node.text;
        if (node.format & 1) text = <strong key={index}>{text}</strong>;
        if (node.format & 2) text = <em key={index}>{text}</em>;
        return <React.Fragment key={index}>{text}</React.Fragment>;
      }

      if (node.type === 'paragraph') {
        return (
          <p key={index} className="mb-4">
            {renderChildren(node.children)}
          </p>
        );
      }

      if (node.type === 'heading') {
        const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements;
        const headingClasses: Record<string, string> = {
          h1: 'text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight',
          h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 leading-tight',
          h3: 'text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight',
          h4: 'text-lg sm:text-xl lg:text-2xl font-bold mb-3 leading-tight',
        };
        return (
          <Tag key={index} className={headingClasses[node.tag] || 'font-bold'}>
            {renderChildren(node.children)}
          </Tag>
        );
      }

      if (node.type === 'list') {
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
        return (
          <ListTag key={index} className={`${node.listType === 'bullet' ? 'list-disc' : 'list-decimal'} ml-6 mb-4 space-y-2`}>
            {renderChildren(node.children)}
          </ListTag>
        );
      }

      if (node.type === 'listitem') {
        return <li key={index}>{renderChildren(node.children)}</li>;
      }

      if (node.type === 'link') {
        return (
          <a key={index} href={node.fields.url} target={node.fields.newTab ? '_blank' : '_self'} className="underline text-[#F37C28] hover:text-[#00629B] transition-colors">
            {renderChildren(node.children)}
          </a>
        );
      }

      if (node.type === 'upload') {
        const value = node.value;
        const url = value.cloudinary_url || value.url;
        if (!url) return null;
        return (
          <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-lg relative aspect-video">
            <Image 
              src={url} 
              alt={value.alt || ''} 
              fill 
              className="object-cover" 
            />
          </div>
        );
      }

      return null;
    });
  };

  return <div className={`prose max-w-none text-gray-700 leading-relaxed ${className}`}>{renderChildren(content.root.children)}</div>;
};

export default RichText;
