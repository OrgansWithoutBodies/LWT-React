const lorem = `Lorem ipsum dolor sit amet. Ut commodi necessitatibus est odit placeat et voluptatem reiciendis est atque quia aut quaerat quod ea corporis consequatur aut sequi tempora? Vel reprehenderit harum qui laudantium repellat non nihil maiores et amet repellendus eum enim ullam. Qui praesentium nostrum hic repellat rerum ut voluptatem dolores non sequi cumque et dolorem minus aut dolorum nihil.\nEos culpa omnis rem voluptate enim sed soluta provident ut quasi possimus quo officia molestiae? Est quae deleniti ea sunt voluptatem ut alias molestiae id sunt odit aut fuga velit ut voluptatem exercitationem.\nAb enim nihil rem illum sint vel minima internos? Non dolorem minima eum soluta ducimus eum labore tenetur ut molestias sapiente aut error iure. Hic maxime eaque et soluta pariatur vel incidunt vero et voluptates accusamus!`;

/**
 *
 * @param len
 */
export function loremIpsum(len: number = 10) {
  return `${lorem.substring(0, len - 3)}...`;
}

export function loremIpsumSplitByWord(numWords: number = 10) {
  return `${lorem.split(" ").slice(0, numWords).join(" ")}`;
}
