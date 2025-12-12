from agents.analyst import calculate_pos
from collections import namedtuple

# Mock object for ScoringBreakdown
Item = namedtuple('Item', ['name', 'score'])

def test_pos():
    print("=== Testing POS 2.0 Logic ===")
    
    # Test Case 1: Perfect Scenario (Blue Ocean, High Confidence)
    breakdown1 = [
        Item(name="Market Magnitude", score=10),
        Item(name="Market Momentum", score=10),
        Item(name="Problem Urgency", score=10),
        Item(name="Competitive Void", score=10), # Empty market
        Item(name="Solution Uniqueness", score=10),
        Item(name="Technical Feasibility", score=10),
        Item(name="Macro Risk", score=10) # Low risk
    ]
    # Weighted Sum: 15+15+25+20+10+10+5 = 100
    score1 = calculate_pos(breakdown1, confidence_level="High")
    print(f"Test 1 (Perfect): {score1} (Expected: 100)")
    assert score1 == 100

    # Test Case 2: Red Ocean Kill Switch (Saturated)
    breakdown2 = [
        Item(name="Market Magnitude", score=10),
        Item(name="Market Momentum", score=8),
        Item(name="Problem Urgency", score=8),
        Item(name="Competitive Void", score=2), # KILL SWITCH (<3)
        Item(name="Solution Uniqueness", score=5),
        Item(name="Technical Feasibility", score=8),
        Item(name="Macro Risk", score=8)
    ]
    # Base: (10*1.5) + (8*1.5) + (8*2.5) + (2*2.0) + (5*1.0) + (8*1.0) + (8*0.5)
    # 15 + 12 + 20 + 4 + 5 + 8 + 4 = 68
    # Penalty: 68 * 0.6 = 40.8 -> 40
    score2 = calculate_pos(breakdown2, confidence_level="High")
    print(f"Test 2 (Red Ocean): {score2} (Expected: 40)")
    assert score2 == 40

    # Test Case 3: Dying Market Kill Switch
    breakdown3 = [
        Item(name="Market Magnitude", score=5),
        Item(name="Market Momentum", score=1), # KILL SWITCH (<2)
        Item(name="Problem Urgency", score=5),
        Item(name="Competitive Void", score=5),
        Item(name="Solution Uniqueness", score=5),
        Item(name="Technical Feasibility", score=5),
        Item(name="Macro Risk", score=5)
    ]
    # Base: (5*1.5) + (1*1.5) + (5*2.5) + (5*2.0) + (5*1.0) + (5*1.0) + (5*0.5)
    # 7.5 + 1.5 + 12.5 + 10 + 5 + 5 + 2.5 = 44
    # Penalty: 44 * 0.7 = 30.8 -> 30
    score3 = calculate_pos(breakdown3, confidence_level="High")
    print(f"Test 3 (Dying Market): {score3} (Expected: 30)")
    assert score3 == 30

    # Test Case 4: Low Confidence Penalty
    # Same as Test 1 (100 base) but Low Confidence
    score4 = calculate_pos(breakdown1, confidence_level="Low")
    # 100 * 0.7 = 70
    print(f"Test 4 (Low Confidence): {score4} (Expected: 70)")
    assert score4 == 70
    
    # Test Case 5: Medium Confidence Penalty
    score5 = calculate_pos(breakdown1, confidence_level="Medium")
    # 100 * 0.9 = 90
    print(f"Test 5 (Medium Confidence): {score5} (Expected: 90)")
    assert score5 == 90

    print("All tests passed!")

if __name__ == "__main__":
    test_pos()
