from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Add mock data before navigating
    page.add_init_script("""
        window.__MOCK_DAO_PROPOSALS__ = [
            {
                id: '1',
                title: 'Install Solar Panels in Urgam Valley',
                description: 'A test proposal',
                proposer: 'proposer-1',
                createdAt: new Date().toISOString(),
                votesFor: 15,
                votesAgainst: 3,
                finalized: false,
                approved: false,
                status: 'Active',
                votingDeadline: new Date(Date.now() + 86400000).toISOString(),
                type: 'Solar Infrastructure',
            },
        ];
        window.__MOCK_MEMBERSHIP_INFO__ = {
            isMember: true,
            memberCount: 50,
            contributionScore: 100,
        };
        window.__MOCK_PROPOSAL_STATS__ = {
            totalProposals: 1,
            activeProposals: 1,
            approvedProposals: 0,
            participationRate: 36,
        };
    """)

    # Navigate to the community page
    page.goto("http://localhost:3001/community")

    # Click the "Governance" tab
    page.get_by_role('tab', name='Governance').click()

    # Wait for the proposal list to be visible, ensuring the component has loaded
    proposal_list = page.get_by_test_id('dao-proposals-list')
    expect(proposal_list).to_be_visible()

    # Click the "Create Proposal" button
    create_button = page.get_by_test_id('create-proposal-button')
    expect(create_button).to_be_visible()
    create_button.click()

    # Wait for the dialog to appear and assert its visibility
    dialog = page.get_by_test_id('create-proposal-dialog')
    expect(dialog).to_be_visible()

    # Assert that the dialog has the correct title
    expect(dialog.get_by_role("heading", name="Create New Proposal")).to_be_visible()

    # Take a screenshot of the dialog
    page.screenshot(path="jules-scratch/verification/verification.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)