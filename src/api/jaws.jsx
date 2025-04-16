import api from './index'

export default {
    validation(category_id = 0, subcategory1_id = 0, subcategory2_id = 0) {
        return api.get(
            `/jaws/validations?category_id=${Number(
                category_id
            )}&subcategory1_id=${Number(subcategory1_id)}&subcategory2_id=${Number(
                subcategory2_id
            )}`
        )
    },
}
