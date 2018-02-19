import Main from '../Dashboard'
import { Card } from '../components'
import { posts } from './db.json'
import App from '../App'
import { createWaitForElement } from 'enzyme-wait'

const waitFor = createWaitForElement('[data-test="Card"]', 5000, 5000)

describe('<Dashboard /> post lists', () => {
  // NOTE: Hey this is now an acceptance test
  xit('shows login form if logged out', () => {
    let w = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(w.find("[data-test='Login Page Container']").exists()).toBe(true)
  })

  // NOTE: this should be an acceptance test
  xit('shows list of Cards if authed and has no posts', async () => {
    await fetch.mockResponse(JSON.stringify(posts))

    let main = mount(
      <MemoryRouter>
        <Main user={user} token={token} />
      </MemoryRouter>
    )

    const loadedMain = await waitFor(main)

    console.log(main.debug())

    expect(main.exists()).toBe(true)
    expect(main.find('h2').contains('Starting Again')).toBe(true)
  })
})
