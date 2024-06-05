import { Extension } from '@tiptap/core';

const DraggableWrapper = Extension.create({
    name: 'draggableWrapper',

    addGlobalAttributes() {
        return [
            {
                types: ['image', 'paragraph', ], // list all node types you want to wrap
                attributes: {
                    draggable: {
                        default: null,
                        renderHTML: () => {
                            return {
                                'data-type': 'draggable-item'
                            };
                        },
                    },
                },
            },
        ];
    },
});

export default DraggableWrapper;