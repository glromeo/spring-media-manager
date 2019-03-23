export default class Options {

    constructor(page, pageSize) {
        this.pageSize = pageSize || 10;
        this.pages = {};
        this.fetching = {};
        this.total = 0;
    }

    size() {
        return this.total;
    }

    select(index) {
        Object.keys(this.pages).forEach(p=>{
            this.pages[p].forEach(row=>{
                row.selected = false;
            });
        });
        this.get(index).selected = true;

    }

    get(index) {
        const pageIndex = this.pageIndex(index);
        const page = this.pages[pageIndex];
        if (page) {
            return page[index % this.pageSize];
        }
        if (this.fetching.hasOwnProperty(pageIndex)) {
            return null;
        }
        return this.fetchPage(pageIndex);
    }

    pageIndex(index) {
        return Math.floor(index / this.pageSize);
    }

    async fetchPage(pageIndex) {

        const controller = this.fetching[pageIndex] = new AbortController();

        const keys = Object.keys(this.fetching).map(Number);
        if (keys.length > 3) {
            const min = Math.min(...keys);
            const max = Math.max(...keys);
            if (Math.abs(pageIndex - min) > Math.abs(pageIndex - max)) {
                this.fetching[min].abort();
                delete this.fetching[min];
                console.debug("aborted fetching of page:", min);
            } else {
                this.fetching[max].abort();
                delete this.fetching[max];
                console.debug("aborted fetching of page:", max);
            }
        }

        const {page, total} = await this.fetch(pageIndex, this.pageSize, controller);

        this.pages[pageIndex] = page;
        this.total = total;

        delete this.fetching[pageIndex];
        console.log("fetched page:", pageIndex)

        return this;
    }

    async fetch(pageIndex, pageSize, controller) {

        const response = await fetch(`/__mock__/users.json?page=${pageIndex}&pageSize${pageSize}`, {
            method: "GET",
            signal: controller.signal
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const entries = await response.json();

        const pageFrom = pageIndex * pageSize;
        const pageTo = pageFrom + pageSize;

        const slice = entries.sort((l, r) => {

            let lv = l['last_name'];
            let rv = r['last_name'];
            let compare = lv ? lv.localeCompare(rv) : rv ? -1 : 0;
            if (compare !== 0) {
                return compare;
            }
            lv = l['first_name'];
            rv = r['first_name'];
            compare = lv ? lv.localeCompare(rv) : rv ? -1 : 0;
            if (compare !== 0) {
                return compare;
            }
            lv = l['email'];
            rv = r['email'];
            return lv ? lv.localeCompare(rv) : rv ? -1 : 0;

        }).slice(pageFrom, pageTo).map(({id, first_name, last_name, email}) => ({
            key: id,
            value: `${last_name},${first_name} (${email})`
        }));

        const length = entries.length;

        console.log("fetched from:", pageFrom, "to:", pageTo, "of:", length);

        return {page: slice, total: length};
    }
}