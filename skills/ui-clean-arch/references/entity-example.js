/**
 * @Entity Product
 */
export const Product = ({
    id = Number(-1),
    title = String('No title'),
    description = String('No description'),
    rating = Number(-1),
    stock = Number(-1),
    brand = String('No Brand defined'),
    category = String('No category'),
    image = String('No url for image'),
    ...rest
}) => ({
    id,
    title,
    description,
    rating,
    stock,
    brand,
    category,
    price: {
        ...ProductPrice(rest)
    }
})

/**
 * @Entity ProductPrice
 */
export const ProductPrice = ({
    price = Number(-1),
    discountPercentage = String('No discount percentage')
}) => ({
    raw: price,
    discount: discountPercentage,
    formatted: price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
})
