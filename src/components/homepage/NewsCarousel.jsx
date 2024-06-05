import * as React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { register } from 'swiper/element/bundle';

register();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://vsiuakofodgkhmclfvpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXVha29mb2Rna2htY2xmdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NTg5OTgsImV4cCI6MjAxNTIzNDk5OH0.ty_9mqxxjK9itXEBCLrFzgtng1tFQGBMRLSwodeGzVk'
);

export function NewsCarousel() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      let { data: newsData, error } = await supabase.from('news').select('*').range(0, 8).order('news_date', { ascending: false });

      if (error) setError(error);
      else setNews(newsData);
    };

    fetchNews();
  }, []);

  return (
    <swiper-container slider-per-view="3">
      {news.map((news, index) => (
        <swiper-slide key={index}>
          <a href={`news/${news.news_url}`} className="p-0">
            <Card className="border-0">
              <CardContent
                className="flex h-72 items-end shadow-2xl rounded-lg p-0 justify-start"
                style={{ backgroundImage: `url(${news.news_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="flex justify-end w-full rounded-b-lg bg-black bg-opacity-50">
                  <span className="text-xl font-semibold p-4 text-white font-shadow">{news.news_title}</span>
                </div>
              </CardContent>
            </Card>
          </a>
        </swiper-slide>
      ))}
    </swiper-container>
  );
}

export default NewsCarousel;
