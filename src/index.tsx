import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import { unified } from 'unified'

/** 位置 */
export class Position {
    column: number
    line: number
    offset: number
}

/** 节点 */
export class Node {
    type: string
    value?: string
    children?: Node[]
    position?: {
        start?: Position
        end?: Position
    }
}

/** 属性 */
export class Options {
    vfile?: string
}

/** 编辑器 */
export class Editor {

    private parser = unified().use(remarkParse).use(remarkFrontmatter)
    private stringifier = unified().use(remarkStringify).use(remarkFrontmatter)

    private context: Node
    private container: HTMLElement

    constructor(container: HTMLElement | null, options?: Options) {
        this._validate(container, options)
        this._init(container, options)
    }

    private _validate(container: HTMLElement | null, options?: Options) {
        if (!container) {
            throw new Error('container must not be empty')
        }
    }

    private _init(container: HTMLElement | null, options?: Options) {
        this.container = container!
        // this.context = this.parser.parse(options?.vfile ?? '---\n\n---\n') as Node
        const _title = document.createElement('div')
        const _content = document.createElement('span')
        _content.setAttribute('contentEditable', 'true')
        const _observer = new MutationObserver((mutations) => {
            console.log('mutations: ', mutations)
            if (mutations.length < 2) {
                return false
            }
            const mutation = mutations[1] // mutations.filter(it => it?.addedNodes && it?.addedNodes?.length)
            const node = mutation?.nextSibling
            console.log(node)
            const _x = document.createElement('div')
            const _xx = document.createElement('span')
            _xx.append(node ?? '')
            _x.append(_xx)
            this.container.after(_x)
        })
        _observer.observe(_content, {
            childList: true,
            subtree: true
        })
        _title.append(_content)
        this.container.append(_title)
    }

    private _render(node: Node): HTMLElement | string {
        const element = document.createElement('div')
        const content = document.createElement('span')
        element.append(content)
        content?.setAttribute('data-id', 'title')
        content?.setAttribute('contentEditable', 'true')
        this._observe(element)
        if (node?.children) {
            const children = node?.children?.map((child: Node) => {
                return this._render(child)
            })
            element.append(...children)
        }

        return element
    }

    private _observe(element: HTMLElement) {
        const _observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
            console.log(mutations)
            // 新增节点
            const _mutations = mutations.filter((mutation: MutationRecord) => mutation.addedNodes.length && '#text' !== mutation?.addedNodes[0]?.nodeName)
            if (_mutations && _mutations.length) {
                _mutations.forEach(_m => {
                    const _next = _m.addedNodes[0] as HTMLDivElement
                    _next?.setAttribute('contentEditable', 'true')
                    // _next?.set = '&ZeroWidthSpace;'
                    this._observe(_next)
                    element.after(_next)
                    _next?.focus()
                })
                return
            }
        })
        _observer.observe(element, {
            childList: true,
            subtree: true,
        })
    }

    private _addInputEventListener(element) {
        element.addEventListener('input', (e: any) => {
            console.log(e)
            if ('insertParagraph' === e?.inputType || ('insertText' === e?.inputType && !e?.data)) {
                const _lastChild = e.target.lastChild
                _lastChild?.setAttribute('contentEditable', 'true')
                if (!_lastChild?.data) {
                    _lastChild.innerHtml = '&ZeroWidthSpace;'
                }
                this._addInputEventListener(_lastChild)
                e.target.after(_lastChild)
                _lastChild.focus()
            }
        })
    }

}

const container = document?.getElementById('root')

const init = () => {
    container?.setAttribute('contentEditable', 'true')
    const observer = new MutationObserver((mutations) => {
        // console.log(container?.childNodes)
        if (!container?.childNodes?.length) {
            createParagraph()
            return false
        }
    })
    observer.observe(container!, {
        childList: true
    })
}

const createParagraph = () => {
    const paragraph = document.createElement('div')
    paragraph.setAttribute('id', 'xxx')
    paragraph.setAttribute('class', 'paragraph')
    paragraph.setAttribute('contentEditable', 'true')
    paragraph.setAttribute('placeholder', 'Press \'/\' for commands... ')
    container?.appendChild(paragraph);
    new MutationObserver((mutations) => {
        console.log(mutations)
        mutations.forEach(mutation => {
            if (mutation.addedNodes?.length && 'BR' === mutation.addedNodes[0]?.nodeName) {
                mutation.target.removeChild(mutation.addedNodes[0])
            }
        })
    }).observe(paragraph, {
        childList: true
    })
    document.getElementById('xxx')?.addEventListener('beforeinput', () => {
        console.log(111111)
    })
}

init()
createParagraph()

/*
const observer = new MutationObserver((mutations) => {
    // console.log(mutations)
    mutations
        .filter(mutation => mutation?.addedNodes
            && mutation?.addedNodes.length
            && '#text' === mutation?.addedNodes[0]?.nodeName)
        .forEach(it => {
            const div = document.createElement('div')
            // it.target.appendChild(div)
            // div.append(it?.addedNodes[0])
            // div.innerText = it?.addedNodes[0]?.textContent ?? ''

        })

})

observer.observe(container!, {
    // attributeFilter: [],
    // attributeOldValue: true,
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
})
*/

// new Editor()










// const observer = new MutationObserver((records, observer) => {
//     observer.takeRecords()
//     console.log(records, observer)
// })
// observer.observe(element, {
//     attributes: true,
//     characterData: true,
//     childList: true,
//     subtree: true,
//     attributeOldValue: true,
//     characterDataOldValue: true
// })
