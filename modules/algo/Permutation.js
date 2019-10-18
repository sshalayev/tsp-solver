class Permutation {
    static getAllPermutations(items) {
        if (items.length < 2) {
            return items.length === 1 ? [items] : [];
        }
        const permutations = [];

        // Get all permutations of length (n - 1).
        const prevItems = items.slice(0, -1);
        // Insert last option into every possible position of every previous permutation.
        const lastItem = items.slice(-1);

        const prevPermutations = Permutation.getAllPermutations(prevItems);
        for (let i = 0; i < prevPermutations.length; i++) {
            const currentPermutation = prevPermutations[i];
            // Insert last option into every possible position of currentPermutation.
            for (let j = 0; j <= currentPermutation.length; j++) {
                const permutationPrefix = currentPermutation.slice(0, j);
                const permutationSuffix = currentPermutation.slice(j);
                permutations.push(permutationPrefix.concat(lastItem, permutationSuffix));
            }
        }
        return permutations;
    }

    static getAllPermutationsAsync(items) {
        if (items.length < 2) {
            return $q.resolve(items.length === 1 ? [items] : []);
        }
        const lastItem = items.pop();

        return Permutation.getAllPermutationsAsync(items).then((prevPermutations) => {
            return prevPermutations.map((currentPermutation) => {
                return currentPermutation.reduce((r, v, i) => {
                    return [...r, [...currentPermutation.slice(0, i + 1), lastItem, ...currentPermutation.slice(i + 1)]];
                }, [[lastItem, ...currentPermutation]]);
            }).reduce((a, b) => a.concat(b))
        });
    }

    static getLimitedPermutations(items, limit) {
        const limitBase = Permutation.findNearestFactorial(limit);
        const mainSet = Permutation.getAllPermutations(items.slice(0, limitBase));

        const steps = math.ceil(limit / mainSet.length);
        return mainSet.reduce((res, item) => {
            for (let i = 0; i < steps; i++) {
                let extSet = Permutation.getRandomPermutation(items.slice(limitBase));
                res.push(item.concat(extSet))
            }
            return res;
        }, [])
    }

    static getRandomLimitedPermutations(items, limit) {
        if (items.length < 2) {
            return items.length === 1 ? [items] : [];
        }
        const maxNum = math.factorial(items.length);
        if (limit >= maxNum) {
            return Permutation.getAllPermutations(items);
        }
        const permutations = [];
        do {
            const newPermutation = Permutation.getRandomPermutation(items);
            const idx = permutations.findIndex((perm) => perm.join() === newPermutation.join());
            if (idx === -1) {
                permutations.push(newPermutation);
            }
        } while (permutations.length < limit);
        return permutations;
    }

    static getRandomPermutation(items) {
        const src = items.slice();
        return items.map(() => {
            const idx = Math.floor(Math.random() * src.length);
            return src.splice(idx, 1)[0];
        });
    }

    static getNonUniqueNumberSequence(len, minTotal = (len + 1) * len / 2) {
        const maxTotal = len * len;
        const targetTotal = minTotal + Math.floor(Math.random() * (maxTotal - minTotal));
        let sum = len;
        const result = Array.apply(null, Array(len)).fill(1);
        do {
            const idx = Math.floor(Math.random() * len);
            if (result[idx] < len) {
                result[idx]++;
                sum++;
            }
        } while (sum < targetTotal);
        return result;
    }

    static getNumberSequence(len, start = 1) {
        return Array.apply(null, Array(len)).map((v, i) => i + start);
    }

    static getOptimalPermutation(items) {
        return items.map((v, i) => {
            return {val: v, idx: i}
        }).sort((a, b) => a.val - b.val).map((v, i) => {
            v.cell = i + 1;
            return v;
        }).sort((a, b) => a.idx - b.idx).map((v) => v.cell);
    }

    static findNearestFactorial(target, base = 1){
        return math.factorial(base + 1) > target ? base : Permutation.findNearestFactorial(target, base + 1)
    }
}
module.exports = Permutation;