import React from 'react'
import './Menu.css'
import { menu_list } from '../../assets/assets'

const Menu = ({ category, setCategory }) => {



    return (
        <div className='menu' id='menu'>
            <h1>Explore Our Menu</h1>
            <p className='menu-text'>At Tomato, our diverse menu celebrates every palate with fresh, locally-sourced ingredients. From hearty comfort food to vibrant vegan dishes and gourmet international cuisine, we ensure there's something for everyone. We prioritize your satisfaction by offering gluten-free, vegetarian, and low-calorie options. With a commitment to quality and seasonal innovation, each meal is a delightful experience waiting to be savored.</p>
            <div className='menu-list'>
                {menu_list.map((item, index) => {
                    return (
                        <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className='menu-list-item'>
                            <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="menu img" />
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default Menu