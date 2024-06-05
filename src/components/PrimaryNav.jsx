import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const components = [
  {
    title: 'Sing for Hope Pianos',
    href: '/pianos',
    description: 'The worlds largest recurring public piano program.',
  },
  {
    title: 'Public Health & Wellbeing',
    href: '/health',
    description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Education',
    href: '/education',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Cultural Diplomacy',
    href: '/diplomacy',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Creative Workforce Development',
    href: '/workforce',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="text-black px-6 z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid z-50 gap-3 p-6 md:w-[800px] lg:w-[900px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <p className="text-sm leading-tight text-muted-foreground">
                      Our creative programs bring hope, healing, and connection to millions of people in hospitals, schools, care facilities, refugee camps,
                      transit hubs, and community spaces worldwide. A non-profit organization founded in New York City in response to the events of 9/11, Sing
                      for Hope partners with hundreds of community-based organizations, mobilizes thousands of artists in creative service, and produces
                      artist-created Sing for Hope Pianos across the US and around the world.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/about" title="Our Mission"></ListItem>
              <ListItem href="/about/#board" title="Board of Directors"></ListItem>
              <ListItem href="/about/#leadership" title="Leadership"></ListItem>
              <ListItem href="/about/#reports" title="Annual Reports & Financials"></ListItem>
              <ListItem href="/about/#press" title="Press"></ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/news" className={navigationMenuTriggerStyle()}>
            News
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef((props, ref) => {
  const { className, title, children, ...otherProps } = props;
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-0 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...otherProps}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = 'ListItem';

export default NavigationMenuDemo;
