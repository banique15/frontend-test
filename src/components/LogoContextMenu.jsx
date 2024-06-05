import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export function LogoContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="z-50 flex-shrink-0 w-[70px] sm:w-[80px] -mt-1 -mb-1 aspect-square">
        <a id="logo-link" href="/" class="no-outline">
          <img src="https://singforhope.org/logo" width="80px" />
        </a>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 rounded-xl">
        <ContextMenuItem inset>View Brand Guide</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Download Logo</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>PNG File</ContextMenuItem>
            <ContextMenuItem>JPG File</ContextMenuItem>
            <ContextMenuItem>EPS File</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default LogoContextMenu;
